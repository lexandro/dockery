docker|mon
==========

A small Docker host monitoring webapp for basic management of images and containers. This is my learning project to get familiar with angular.js and Twitter 
bootstrap frameworks. All fixed, changes, enhancement or ideas are welcome! :)


Enable remote access to docker daemon
=====================================

To manage your docker host(s) with **dockermon** please please add the following parameters to your docker daemon launcher:

```bash
 $ docker -d -H=0.0.0.0:2375 -api-enable-cors
```

