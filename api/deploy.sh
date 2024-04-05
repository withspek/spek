# build the image
# sudo docker build -t irere/spek:lastest .
# copy the image to the dokku host
# sudo docker save irere/spek:lastest | bzip2 | ssh -i ~/.ssh/spe_key.pem azureuser@172.208.9.189 "sudo -i bunzip2 | docker load"
# tag and deploy the image
ssh -i ~/.ssh/spe_key.pem azureuser@172.208.9.189 "sudo -i && docker pull irere/spek:lastest && docker tag irere/spek:lastest dokku/api:lastest && dokku tags:create api previous; dokku tags:deploy api lastest && dokku tags:create api latest"
