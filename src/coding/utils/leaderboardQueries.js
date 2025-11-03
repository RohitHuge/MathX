// Centralized SQL queries for leaderboard logic

export const SQL_OVERALL = `
  select
    s.user_id,
    u.name,
    sum(s.score) as total_score,
    sum(s.time_taken) as total_time,
    rank() over (order by sum(s.score) desc, sum(s.time_taken)) as rank
  from submissions s
  join users_public u on s.user_id = u.user_id
  where s.status = '1'
  group by s.user_id, u.name;
`;

export const SQL_ROUND = `
  select
    s.user_id,
    u.name,
    p.title as problem,
    s.round_no,
    s.score,
    s.time_taken,
    rank() over (partition by s.round_no order by s.score desc, s.time_taken) as round_rank,
    rank() over (
      order by sum(s.score) over (partition by s.user_id) desc,
               sum(s.time_taken) over (partition by s.user_id)
    ) as global_rank
  from submissions s
  join problems p on s.problem_id = p.problem_id
  join users_public u on s.user_id = u.user_id
  where s.status = '1';
`;
