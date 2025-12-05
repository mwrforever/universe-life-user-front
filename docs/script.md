1. ps停止对应端口的服务命令
```bash
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force 
```