# How to

- `npm i`
- `sudo apt-get install pigpio`
- `sudo apt-get install -y mpg123`
- `sudo npm start`

# TODO

- Re-boot from web interface (restart systemd)
- Fix time formatting missing 0's
- Currently playing song
- Enable/Disable completly

# If Bored

- Override hardrware toggle button (ordered, on the way)

# Nopetown

- `say` zero cannot handle this - gets killed

# Systemd

- `sudo systemctl daemon-reload` - reload systemd
- `sudo systemctl start ateja`
- `journalctl -u ateja.service -f` - tailing logs
- `sudo systemctl status ateja`
- `sudo systemctl stop ateja`
- `sudo systemctl restart ateja`
- `sudo systemctl enable ateja`
- `sudo systemctl disable ateja`
