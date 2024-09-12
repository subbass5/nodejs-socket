# ใช้ Node.js image
FROM node:18

# ตั้งค่าพาธทำงาน
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดแอปพลิเคชัน
COPY . .

# คัดลอกใบรับรอง SSL
COPY ./certs /certs

# เปิดพอร์ตที่เซิร์ฟเวอร์ใช้งาน
EXPOSE 80 443

# คำสั่งเริ่มต้น
CMD ["node", "server.js"]