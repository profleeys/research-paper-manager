# Research Paper Manager (研究論文管理系統)

一個專為研究生與學者設計的輕量級研究論文管理系統，作為 Google Antigravity Agentic Programming 教學 Demo 專案。

## 🌟 核心功能特點
- **使用者驗證 (JWT Auth)**：支援註冊與登入，密碼使用 bcrypt 雜湊加密，資料完全隔離。
- **統計儀表板 (Dashboard)**：即時統計論文總數、研讀中 (Reading)、已完成 (Completed) 與高重要度 (Important)，並展示最近 5 篇文獻。
- **論文庫完整 CRUD (Paper Management)**：
  - 新增論文（支援題目、作者、年份、領域分類、狀態、重要程度與研究筆記）。
  - 論文列表檢視（卡片風格，含色彩徽章標籤）。
  - 詳細檢視頁面與筆記閱讀。
  - 即時編輯與更新。
  - 防誤觸刪除確認彈窗 (Confirmation Modal)。
- **即時搜尋與篩選 (Search & Filter)**：
  - 支援依 Title 與 Authors 即時關鍵字檢索。
  - 支援依 Category (領域)、Status (閱讀狀態)、Priority (重要度) 聯動篩選。
- **簡潔專業學術風 UI**：基於 Tailwind CSS 構建的 Modern Academic Dashboard 風格，具備響應式設計。
- **測試帳號與預設資料 (Seed Data)**：
  - Email：`demo@example.com`
  - 密碼：`demo123`
  - 內建 5 篇經典 AI/ML 論文範例。

---

## 🛠️ 技術架構
- **Frontend**：React 18、Vite、React Router v6、Tailwind CSS、Lucide React。
- **Backend**：Node.js、Express、JWT (`jsonwebtoken`)、`bcryptjs`、CORS。
- **Database**：本機 SQLite (`research.db`，使用 Node 內建 `node:sqlite`，免額外安裝 DB 伺服器)。

---

## 🚀 快速啟動指南 (How to Run)

### 1. 安裝相依套件 (若未安裝)
```bash
# 後端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 2. 啟動服務
開啟兩個終端機視窗：

- **啟動後端 API (Port 5000)**：
  ```bash
  cd backend
  npm start
  ```
  *(伺服器啟動時會自動檢查並填充 Demo 測試資料)*

- **啟動前端介面 (Port 3000)**：
  ```bash
  cd frontend
  npm run dev
  ```

瀏覽器開啟：`http://localhost:3000` 即可開始體驗！

---

## 🧪 執行自動化測試
專案根目錄包含端到端全流程驗證腳本：
```bash
node test-flow.js
```
測試涵蓋：
- 註冊驗證與重複帳號拒絕
- 登入簽發 JWT 與 `/api/auth/me`
- 多租戶使用者資料隔離檢驗
- 論文新增、列表、關鍵字搜尋、多條件篩選
- 論文詳情查詢、修改、刪除

