docker|mon
==========

A small Docker host monitoring webapp for basic management of images and containers. This is my learning project to get familiar with angular.js and Twitter 
bootstrap frameworks. 

All fixes, changes, enhancement or ideas are welcome! :)


Enable remote access to Docker daemon
=====================================

To manage your docker host(s) with **dockermon** please please add the following parameters to your Docker daemon launcher:

```bash
 $ docker -d -H=0.0.0.0:2375 -api-enable-cors
```

or edit your **/etc/default/docker** file:

```bash
DOCKER_OPTS='-H tcp://0.0.0.0:2375 -api-enable-cors'
```

then issue the following command to activate changes:
```bash
service docker restart
```

