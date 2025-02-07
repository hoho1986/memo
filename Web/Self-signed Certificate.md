# Self-signed Certificate

## Self-signed Certificate Authority

1. Create private key via `openssl genrsa -des3 -out myCA.key 4096` and enter password for the key.
2. Create certificate via `openssl req -new -x509 -days 3650 -key myCA.key -out myCA.crt`
2. You can get certificate and private key in working directory.

## Self-signed Certificate

1. Create private key via `openssl genrsa -out localhost.key 4096`.
2. Create a configuration file with below content and change to appropriate value on sections `req_distinguished_name` and `alt_names`.
   ``` localhost.cnf
   [req]
   default_md = sha256
   prompt = no
   req_extensions = req_ext
   distinguished_name = req_distinguished_name
   
   [req_distinguished_name]
   commonName = *.localhost
   countryName = HK
   stateOrProvinceName = Hong Kong
   localityName = Tseung Kwan O
   organizationName = Individual
   
   [req_ext]
   keyUsage=critical,digitalSignature,keyEncipherment
   extendedKeyUsage=critical,serverAuth,clientAuth
   subjectAltName = @alt_names
   
   [alt_names]
   DNS.1=localhost
   DNS.2=*.localhost
   ```
3. Create a Certificate Signing Request (CSR) file via `openssl req -new -nodes -key localhost.key -config localhost.cnf -out localhost.csr`
4. You may double check CSR X509v3 Subject Alternative Name via `openssl req -noout -text -in localhost.csr`
5. Generate self-signed certificate for domain via `openssl x509 -req -in localhost.csr -CA myCA.crt -CAkey myCA.key -CAcreateserial -out localhost.crt -days 3650 -sha256 -extfile localhost.cnf -extensions req_ext`.

## Install the Certificate into OS

1. Run `certmgr.msc`
2. Right Click All Task -> Import
3. Install myCA.crt by following the wizard
 
 (Firefox use own CA Manager)