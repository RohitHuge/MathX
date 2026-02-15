import { supabase } from '../../../config/supabaseClient';

export const checkTeamNameAvailability = async (teamName) => {
    if (!teamName) return false;

    try {
        const { data, error } = await supabase
            .from('teams')
            .select('team_name')
            .eq('team_name', teamName)
            .single();

        if (error && error.code === 'PGRST116') {
            // PGRST116 means no rows found, which is good - name is available
            return true;
        }

        if (data) {
            // Name exists
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking team name:', error);
        return false; // Assume unavailable on error to be safe
    }
};

export const uploadPaymentScreenshot = async (file) => {
    if (!file) throw new Error('No file provided');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `screenshots/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error('Failed to upload payment screenshot');
    }

    const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(filePath);

    return publicUrl;
};

export const submitRegistration = async (formData) => {
    const { teamName, members, leaderIndex, payment } = formData;

    // 1. Upload Screenshot first
    let screenshotUrl = '';
    try {
        if (payment.screenshot instanceof File) {
            screenshotUrl = await uploadPaymentScreenshot(payment.screenshot);
        } else {
            throw new Error("Payment screenshot is missing or invalid.");
        }
    } catch (e) {
        throw new Error(`Payment upload failed: ${e.message}`);
    }

    // Generate Reference ID
    const refId = `MX-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. Create Team
    const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([{
            team_name: teamName,
            status: 'pending',
            ref_id: refId
        }])
        .select()
        .single();

    if (teamError) throw new Error(`Failed to create team: ${teamError.message}`);
    const teamId = teamData.id;

    try {
        // 3. Create Members
        const membersToInsert = members.map((member, index) => ({
            team_id: teamId,
            full_name: member.name,
            email: member.email,
            phone: member.phone,
            college_name: member.college,
            is_leader: index === leaderIndex
        }));

        const { error: membersError } = await supabase
            .from('members')
            .insert(membersToInsert);

        if (membersError) throw new Error(`Failed to add members: ${membersError.message}`);

        // 4. Create Payment Record
        const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
                team_id: teamId,
                screenshot_url: screenshotUrl,
                transaction_id: payment.transactionId || null,
                status: 'pending'
            }]);

        if (paymentError) throw new Error(`Failed to record payment: ${paymentError.message}`);

        return { success: true, teamId, refId: refId };

    } catch (error) {
        // Rollback: Delete team if subsequent steps fail
        // Note: Cascading delete on team_id should clean up members/payments if partially created
        await supabase.from('teams').delete().eq('id', teamId);
        throw error;
    }
};
