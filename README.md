# How to

- `npm i`
- `sudo apt-get install -y mpg123`
- `sudo npm start`
- `/etc/systemd/ateja.service`

# /boot/config.txt

`gpio=22,27=pu`
`gpio=4=pd`

# Perhaps one day

- Lock UI while waiting for response
- Indicate if ICY meta is not provided
- Show message if selected URL cannot be played for some reason

# Systemd

- `sudo systemctl daemon-reload` - reload systemd
- `sudo systemctl start ateja`
- `journalctl -u ateja.service -f` - tailing logs
- `sudo systemctl status ateja`
- `sudo systemctl stop ateja`
- `sudo systemctl restart ateja`
- `sudo systemctl enable ateja`
- `sudo systemctl disable ateja`
