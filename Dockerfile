FROM busybox

COPY . /www/

EXPOSE 80

CMD ["httpd","-f","-p","80","-h","/www"]
