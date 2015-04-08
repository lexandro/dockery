docker|mon
==========

Version: 0.1.something (not ready for releasing)

A small Docker host monitoring webapp for basic management of images and containers. This is my learning project to get familiar with angular.js and Twitter 
bootstrap frameworks. 

All fixes, changes, enhancements or ideas are welcome! :)


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

TODO
====

- change paging buttons/style on containers/container details/diff listing
- add log view to containers/container details/diff listing
- add TTY view to containers/container details/diff listing
- make containers/container details head smaller


- add rename to container list view
- add list last n items to container list view
- add list since filter to container list view 
- add list before filter to container list view 
- add exit code filter to container list view 
- add status filter to container list view
 
- add go first, go last to containers/container details/diff listing

- add "Please wait..." view/anim for time consuming operation 

- fix default connection issue (two green buttons on hosts view)

- add tag list to the image details
- add image deletion to the image list view
- add image pulling to the image list view 
- redesign host information page...drastically :)