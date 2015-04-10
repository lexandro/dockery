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

0.1.2
- Add: TTY view to containers/container details/diff listing

0.1.3
- Add: container details diff view: refresh button 
- Fix: finish container details page TBD items
- Fix: make containers/container details head smaller
- Fix: Don't call top when container is stopped
- Fix: Don't cut down first character on displayed container name when the first char differ from '/'

0.1.4
- Add: "Please wait..." view/anim for time consuming operations (container size, diff, ps, etc...)
- Fix: default connection issue (two green buttons on hosts view)

0.1.5
- Add: start/stop/pause/kill/etc.. button to container list view

0.1.6
- Add: start/stop/pause/kill/etc.. button to container details view

0.2.0
- Add: rename container to container list view

0.2.1
- Add: list last n items to container list view
- Add: list since filter to container list view 
- Add: list before filter to container list view 
- Add: exit code filter to container list view 
- Add: status filter to container list view

0.2.2
- Add: create container view

0.3.0
- Fix: show image name in the image details
- Add: tag list to the image details

0.3.1
- Add: image deletion to the image list view

0.3.2
- Add: list active containers related to the image in image details

0.3.3
- Add: login into the docker hub and/or private repo(s) 
- Add: image pulling to the image list view

0.4.0
- Fix: redesign host information page...drastically++ :)

0.4.1
- Add: helper links to the known fields/information pieces to help understand

0.4.2
- Add: also add tooltips to these items on all views

0.5.0
- Fix: make it more responsive

0.5.1
- Add: download file link to containers/container details/diff listing items
- Add: option to show containers logs as formatted/raw 

Not scheduled
=============
- Help
- docker image with version check in the webapp

Far future, not decided yet
===========================
- Add repeated pinging to containers (the list and per container)
- Detect fig/compose naming pattern
- Grep colored logs on container with pluggable patterns
- Multiple container log tailing with one click/window
- Ping open ports for spring actuator endpoints (health, ping, info, etc...) Risky...
- Ping open ports for swagger endpoint (/api_docs)

Done
====

0.1.1
- Add: log view to containers/container details/diff listing

0.1.0
- Add: go first, go last to containers/container details/diff listing