# Works on linux 
ip="$(dig resolver1.opendns.com ANY myip.opendns.com +short | awk '{print $1; exit}')"
data='{"secret": "SECRET!","ip": "'$ip'", "domain": "example.com"}'
curl --header "Content-Type: application/json" \
  --request POST \
  --data  "$(echo $data)" \
    https://asdasdasd.execute-api.eu-west-2.amazonaws.com/prod/