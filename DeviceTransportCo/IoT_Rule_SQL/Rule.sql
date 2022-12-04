SELECT 
  'The fuel level for ' + device + ' is currently at ' + round(fuel_level) + '%. The truck is at ' + longitude + ' of longitude and ' + latitude + ' of latitude.' AS message
FROM 'truck/telemetry' 
WHERE 
  fuel_level < 25