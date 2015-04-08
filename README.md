docker|mon
==========

Version: 0.1.something (not ready for releasing)

Yet Another Docker Host Monitoring And Investigating Webapp To Make Images And Container Management Easier.  

This is my learning project to get familiar with angular.js and Twitter bootstrap frameworks, so be please patient :) 

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

Roadmap /by priority/
=====================

0.1.0
- change paging buttons/style on containers/container details/diff listing
- add go first, go last to containers/container details/diff listing

0.1.1
- add log view to containers/container details/diff listing

0.1.2
- add TTY view to containers/container details/diff listing

0.1.3
- make containers/container details head smaller
- finish container details page TBD items

0.1.4
- add "Please wait..." view/anim for time consuming operations (container size, diff, ps, etc...)
- fix default connection issue (two green buttons on hosts view)

0.2.0
- add rename container to container list view

0.2.1
- add list last n items to container list view
- add list since filter to container list view 
- add list before filter to container list view 
- add exit code filter to container list view 
- add status filter to container list view
0.2.2
- add create container view

0.3.0
- add tag list to the image details

0.3.1
- add image deletion to the image list view

0.3.2
- list active containers related to the image in image details

0.3.3
- add login into the docker hub and/or private repo(s) 
- add image pulling to the image list view

0.4.0
- redesign host information page...drastically++ :)

0.4.1
- add helper links to the known fields/information pieces to help understand

0.4.2
- also add tooltips to these items on all views

0.5.0
- make it more responsive

0.5.1
- help (?)

Far future, not decided yet
===========================
- Add repeated pinging to containers (the list and per container)
- Detect fig/compose naming pattern
- Grep colored logs on container with pluggable patterns
- Multiple container log tailing with one click/window
- Ping open ports for spring actuator endpoints (health, ping, info, etc...) Risky...
- Ping open ports for swagger endpoint (/api_docs)