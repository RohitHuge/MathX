// Optional centralized SQL strings (for reference if swapping to RPC or SQL-only)
export const SQL_OVERALL = `
  select user_id, name, sum(time_taken) as total_time,
         rank() over (order by sum(time_taken)) as rank
  from submissions
  where status = '1'
  group by user_id, name;
`;

export const SQL_ROUND = `
  select user_id, name, problem_title as problem, round_no, time_taken,
         rank() over (partition by round_no order by time_taken) as round_rank,
         rank() over (partition by problem_id order by time_taken) as problem_rank,
         rank() over (order by sum(time_taken) over (partition by user_id)) as global_rank
  from submissions
  join problems using (problem_id)
  where status = '1';
`;
