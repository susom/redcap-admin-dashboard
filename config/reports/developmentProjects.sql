SELECT
    projects.project_id AS 'PID',
    app_title AS 'Project Title',
    CAST(CASE
        WHEN record_count IS NULL THEN 0
        ELSE record_count
    END AS CHAR(10)) AS 'Record Count',
    CAST(CASE purpose
        WHEN 0 THEN 'Practice / Just for fun'
        WHEN 4 THEN 'Operational Support'
        WHEN 2 THEN 'Research'
        WHEN 3 THEN 'Quality Improvement'
        WHEN 1 THEN 'Other'
        ELSE purpose
    END AS CHAR(50)) AS 'Purpose',
    CAST(CASE
        WHEN projects.date_deleted IS NULL THEN 'N/A'
        ELSE projects.date_deleted
    END AS CHAR(50)) AS 'Project Deleted Date (Hidden)',
    DATE_FORMAT(creation_time, '%Y-%m-%d') AS 'Creation Date',
    DATE_FORMAT(last_logged_event, '%Y-%m-%d') AS 'Last Logged Event Date',
    DATEDIFF(now(), last_logged_event) AS 'Days Since Last Event'
FROM redcap_projects AS projects
LEFT JOIN redcap_record_counts ON redcap_record_counts.project_id = projects.project_id
WHERE projects.status = 0
    $formattedFilterSql
ORDER BY app_title