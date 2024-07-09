import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import {Dashboard} from './pages/dashboard'
import {Landing} from './pages/landing'
import { FollowUp } from "./pages/followup";
import { ScheduledEmails } from "./pages/scheduledEmails";
import { Templates } from "./pages/templates";
import { CreateTemplate } from "./pages/createtemplate";
import { CreateSchedule } from "./pages/createSchedule";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>} />
          {/* <Route path="/dashboard/:userId" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<CreateSchedule />} />
          <Route path="/followup" element={<FollowUp />} />
          <Route path="/scheduledEmails" element={<ScheduledEmails />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/createTemplate" element={<CreateTemplate />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
