import { Route, Routes } from 'react-router-dom'
import './index.css'
import Dashboard from './components/Dashboard'
import AddReader from './components/AddReader'
import ViewReaders from './components/ViewReaders'
import EditReader from './components/EditReader'
import ViewReader from './components/ViewReader'
import AddDrug from './components/AddDrug'
import ViewDrugs from './components/ViewDrugs'
import RfidLive from './components/RfidLive'
import TemperatureLogs from './components/TemperatureLogs'
import TraceabilityLogs from './components/TraceabilityLogs'
import StatsDashboard from './components/StatsDashboard'


function App() {

  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path="/readers/add" element={<AddReader />} />
      <Route path="/readers" element={<ViewReaders />} />
      <Route path="/readers/edit/:readerId" element={<EditReader />} />
      <Route path="/readers/view/:readerId" element={<ViewReader />} />
      <Route path="/drugs/add" element={<AddDrug />} />
      <Route path="/drugs" element={<ViewDrugs />} />
      <Route path="/rfid/live" element={<RfidLive />} />
      <Route path="/logs/temperature" element={<TemperatureLogs />} />
      <Route path="/logs/traceability" element={<TraceabilityLogs />} />
      <Route path="/stats" element={<StatsDashboard />} />


    </Routes>
  )
}

export default App
