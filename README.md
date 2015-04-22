# docker|mon

Version: 0.1.something (not ready for releasing)

Yet Another Docker Host Monitoring And Investigating Webapp To Make Images And Container Management Easier. (YADHMAIWTMIACME :) )  


This is my learning project to get familiar with angular.js and Twitter bootstrap frameworks, so be please patient :)
 
 
## Table of Contents
**[Enable remote access to Docker daemon](#enable-remote-access-to-docker-daemon)**
**[Beta screenshots](#beta-screenshots)**
**[Development roadmap] (#development-roadmap)**

### Table of Contents
**[Installation Instructions](#installation-instructions)**  
**[Usage Instructions](#usage-instructions)**  
**[Troubleshooting](#troubleshooting)**  
**[Compatibility](#compatibility)**  
**[Notes and Miscellaneous](#notes-and-miscellaneous)**  
**[Building the Extension Bundles](#building-the-extension-bundles)**  
**[Next Steps, Credits, Feedback, License](#next-steps)**  
 

## Enable remote access to Docker daemon

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

## Beta screenshots
These screenshots are not representing the final version!

### List of docker hosts
![hosts](docs/images/screenshot_hosts.jpg "List of hosts")

### Host details
![host details](docs/images/screenshot_host_details.jpg "Details of the selected host")

### List of docker host containers
![containers](docs/images/screenshot_containers.jpg "List of docker host containers")

### Docker container details
![container details](docs/images/screenshot_container_details.jpg "Docker container details")

### List of docker host images
![images](docs/images/screenshot_images.jpg "List of docker host images")

### Docker image details
![image details](docs/images/screenshot_image_details.jpg "Docker image details")

# Development roadmap
Here's the list of active, scheduled, planned and finished development goals

## Under development
0.1.9
z
- Fix: display port assignments [exposed image without public, exposed with -P, exposed with -p, portless image with -P, portless image with -p]
- Fix: image non-port exposure issue at: http://localhost:63342/dockermon/app/imageDetails/imageDetails.js:23:63

## Roadmap /by priority/
0.2.0
- Add: rename container to container list view - Remote api version dependent feature

0.2.1
- Add: list last n items to container list view
- Add: list since filter to container list view 
- Add: list before filter to container list view 
- Add: exit code filter to container list view 
- Add: status filter to container list view

0.2.2
- Add: create container view
 

0.2.3
- Add: containers: command popover to show the whole command

0.1.7
  - Add: containerdetails/volumes-from (get volume from other containers)

0.3.0
- Add: tag list to the image details
- Fix: show image name in the image details

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
- Fix: TTY terminal doubles characters in some cases.  

0.5.2 
- Add: add search for container diff
- Add: set refresh interval on container listing
- Fix: Adding new host sometimes causing index by errors.

0.6
- Add: show containerdetails/ cpu/network datastream as diagram/graph or stg. else 

0.6.1
- Add: paging of containers
- Add: select all/select page on containers

0.6.2
- Add: paging of images
- Add: select all/select page on images

## Not scheduled
- Help
- docker image with version check in the webapp
- Add copyright when released or published (xterm.js, json-formatter)

Far future, not decided yet
- Make features docker host remote api version aware. Hide non-existing functions
- Redesign layout from top menu to side menu
- Add repeated pinging to containers (the list and per container)
- Detect fig/compose naming pattern
- Grep colored logs on container with pluggable patterns
- Multiple container log tailing with one click/window
- Ping open ports for spring actuator endpoints (health, ping, info, etc...) Risky...
- Ping open ports for swagger endpoint (/api_docs)
- Swarm support
- compose yml support

Done
0.1.1
- Add: log view to containers/container details/diff listing

0.1.0
- Add: go first, go last to containers/container details/diff listing

0.1.2
- Add: TTY view to containers/container details/tty listing

0.1.3 
- Add: container details diff view: refresh button 
- Fix: finish container details page TBD items
- Fix: make containers/container details head smaller
- Fix: Don't call top when container is stopped
- *not fixed*: Don't cut down first character on displayed container name when the first char differ from '/' - replaced with Full name feature.

0.1.4
- Add: "Please wait..." view/anim for time consuming operations (container size, diff, ps, etc...)
- Fix: default connection issue (two green buttons on hosts view)
- Fix: image details view error with root images/no port exposed images because of a missing property

0.1.5
- Add: start/stop/pause/kill/etc.. button to container list view to manage containers
- Fix: select all containers, not selected all containers properly.

0.1.6
- Add: start/stop/pause/kill/etc.. button to container details view to manage a container
- Add: group containers by their state [running, paused, stopped]
- Fix: loading process always displayed on stopped containers
- Fix: no previuously loaded top data shown for just stopped containers on the containersdetails page

0.1.7
- Add: containerdetails/volumes
  
0.1.8
- Rescheduled