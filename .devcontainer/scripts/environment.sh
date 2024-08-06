# api
cat >> "/home/$USERNAME/.bashrc" << EOL

# Spek API environment variables 
export DATABASE_URL=postgres://postgres:postgres@localhost/spek_repo2
export RABBITMQ_URL=amqp://guest:guest@localhost:5672
export ACCESS_TOKEN_SECRET=vMn5ugMX4c5QDobbjZaP102Na4ltVEUsJ3rZy8g+JJg=
export REFRESH_TOKEN_SECRET=tig/V+KnDr3Vg3/YzPYlzHr73RYjW+5CmH0DCwi38KM=
export GITLAB_APP_ID="your-gitlab-app-id"
export GITLAB_APP_SECRET="your-gitlab-app-secret"
export GITLAB_REDIRECT_URI=http://localhost:4001/auth/gitlab/callback
export GITHUB_CLIENT_ID="iuhfi4gf3yfegefwefiywefwegifwefgwe"
export GITHUB_CLIENT_SECRET="fiewufhewuifewgfweoifgweofwehfogewgf"
export GITHUB_REDIRECT_URI=http://localhost:4001/auth/github/callback
export API_URL=http://localhost:4001
export WEB_URL=http://localhost:3000
export PORT=4001
EOL

sudo chown $USERNAME /workspace

npm i -g pnpm

# forge - Voice server
# echo "WEBRTC_LISTEN_IP=127.0.0.1" > forge/.env

