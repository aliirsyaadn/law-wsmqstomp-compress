zip -qr - $1 | pv -bep -s $(du -bs $1 | awk '{print $1}') > 'file.zip'
