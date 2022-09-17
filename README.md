# How to

- `sudo apt-get update`
- `sudo apt-get install pigpio`
- `npm i`
- `sudo apt-get install -y mpg123`
- `sudo npm start`
- `/etc/systemd/ateja.service`

# /boot/config.txt

`gpio=22,27=pu`
`gpio=4=pd`

# Systemd

- `sudo systemctl daemon-reload` - reload systemd
- `sudo systemctl start ateja`
- `journalctl -u ateja.service -f` - tailing logs
- `sudo systemctl status ateja`
- `sudo systemctl stop ateja`
- `sudo systemctl restart ateja`
- `sudo systemctl enable ateja`
- `sudo systemctl disable ateja`
