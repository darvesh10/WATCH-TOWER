<div align="center">
  
  # 🗼 WatchTower
  
  **A Distributed, Real-Time Website Monitoring & Observability Platform**
  
  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](#)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](#)
  [![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](#)
  [![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](#)
  [![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)](#)

</div>

<br/>

> **🚀 Watch the Demo:** [Insert Video/Drive Link Here]

## ⚡ The Engineering Challenge

Building a simple uptime checker is easy with a `setInterval` loop. But building a **scalable, multi-tenant monitoring system** that tracks thousands of URLs, logs historical latencies, isolates user data, and visualizes it in real-time is a complex distributed systems problem.

WatchTower was built as an intensive engineering project to master **Message Queues (BullMQ), Persistent State Syncing, and Time-Series Observability (Prometheus + Grafana).**

---

## 🏗️ Monitoring Lifecycle Architecture

WatchTower completely decouples the user-facing API from the heavy lifting of background pinging.

```mermaid
graph TD

    A[👨‍💻 User Login / Signup] --> B[Next.js Dashboard]

    B -->|JWT Auth Request| C[Express.js Backend]

    B -->|Add Monitor URL| C

    C -->|Store User & Monitor Data| D[(Neon PostgreSQL)]

    C -->|Create Monitoring Job| E[(Upstash Redis Queue / BullMQ)]

    E --> F[Background Worker]

    F -->|Ping Website Every Interval| G[(Target Website)]

    F -->|Store Status & Latency| D

    F -->|Expose Metrics| H[Prometheus]

    H --> I[Grafana Dashboard]

    I -->|Embedded Analytics| B

    F -->|Downtime Alert 🚨| J[Discord Webhook]
