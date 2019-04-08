SELECT
    projects.project_id AS PID,
    app_title AS 'Project Title',
    CAST(CASE status
        WHEN 0 THEN 'Development'
        WHEN 1 THEN 'Production'
        WHEN 2 THEN 'Inactive'
        WHEN 3 THEN 'Archived'
        ELSE status
    END AS CHAR(50)) AS 'Status',
    CAST(CASE
        WHEN projects.date_deleted IS NULL THEN 'N/A'
        ELSE projects.date_deleted
    END AS CHAR(50)) AS 'Project Deleted Date (Hidden)',
    record_count AS 'Record Count',
    purpose_other AS 'Purpose Specified',
    project_pi_lastname AS 'PI Last Name',
    project_pi_firstname AS 'PI First Name',
    project_pi_email AS 'PI Email',
    project_irb_number AS 'IRB Number',
    DATE_FORMAT(creation_time, '%Y-%m-%d') AS 'Creation Date',
    DATE_FORMAT(last_logged_event, '%Y-%m-%d') AS 'Last Logged Event Date',
    DATEDIFF(now(), last_logged_event) AS 'Days Since Last Event'
FROM redcap_projects as projects
LEFT JOIN redcap_record_counts ON projects.project_id = redcap_record_counts.project_id
WHERE purpose = 2  -- 'Research'
    $formattedFilterSql
ORDER BY app_title