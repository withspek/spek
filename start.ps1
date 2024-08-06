$env = $args[0]
$cmd = $args | Select-Object -Skip 1
docker compose -f compose.yaml -f compose.$env.yaml -f compose.config.yml $cmd up