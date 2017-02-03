#!/bin/sh

ssh bdv rm -r /home/tempo/tracks.1
ssh bdv mkdir /home/tempo/tracks.1
scp -r -C build/* bdv:/home/tempo/tracks.1

ssh bdv rm -r /home/tempo/tracks.old
ssh bdv mv /home/tempo/tracks /home/tempo/tracks.old
ssh bdv mv /home/tempo/tracks.1 /home/tempo/tracks

