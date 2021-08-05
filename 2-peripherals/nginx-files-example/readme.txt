Example files and folder/directory structures:


Website Content:
/var/www/html/index.nginx-debian.html        (default nginx content)
/var/www/ip-addrress-content/html/index.html (content shown at bare IP address)
/var/www/example.com/html/index.html         (content shown at example.com)
/var/www/sub.example.com/html/index.html     (content shown at sub.example.com)


Nginx server blocks (simple version):
/etc/nginx/sites-available/default
/etc/nginx/sites-available/example.com

Nginx server block links (simple version):
/etc/nginx/sites-enabled/default      (link to server block)
/etc/nginx/sites-enabled/example.com  (link to server block)


Nginx server blocks (more elaborate):
/etc/nginx/sites-available/default                           (insecure)
/etc/nginx/sites-available/default-secure
/etc/nginx/sites-available/ip-address-content                (insecure)
/etc/nginx/sites-available/ip-address-default                (insecure)
/etc/nginx/sites-available/example.com-static-insecure
/etc/nginx/sites-available/example.com-static-secure
/etc/nginx/sites-available/example.com-port-secure-test
/etc/nginx/sites-available/example.com-port-secure
/etc/nginx/sites-available/sub.example.com-static-insecure
/etc/nginx/sites-available/sub.example.com-static-secure
/etc/nginx/sites-available/sub.example.com-port-secure-test
/etc/nginx/sites-available/sub.example.com-port-secure

Nginx server block links (more elaborate):
/etc/nginx/sites-enabled/default-secure               (link to server block)
/etc/nginx/sites-enabled/ip-address-default           (link to server block)
/etc/nginx/sites-enabled/example.com-static-secure    (link to server block)
/etc/nginx/sites-enabled/sub.example.com-port-secure  (link to server block)


Files modified:
/etc/nginx/nginx.conf   (nginx configuration)

Location of SSL certificates:
/etc/letsencrypt/archive/example.com/  (files here)
/etc/letsencrypt/live/example.com/     (links to files here)

(Note that for SSL certificates, there's an 'example.com' file and no
'sub.example.com' file, so both server blocks 'example.com-secure...' and
'sub.example.com-secure...' will refer to the same 'example.com' SSL
certificate.)