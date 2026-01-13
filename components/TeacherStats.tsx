
import React, { useState } from 'react';
import { Users, Clock, AlertTriangle, CheckCircle, Activity, Search, BarChart2, List, Plus, X, BrainCircuit, MessageSquare, Mic, Star, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { StudentStats, ChatMessage } from '../types.ts';

interface Props {
  stats: StudentStats;
  chatHistory: ChatMessage[];
}

interface Student {
  id: number;
  name: string;
  status: string;
  task: string;
  progress: number;
  avatarColor: string;
  time: string;
  error?: string; // Optional field for error messages
}

// 模拟的班级数据
const MOCK_CLASS_STATS = {
    totalStudents: 42,
    onlineStudents: 38,
    avgProgress: 65,
    activeAlerts: 3
};

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "陈小丽", status: "ACTIVE", task: "轴系拆解", progress: 85, avatarColor: "bg-pink-500", time: "12m" },
  { id: 2, name: "张伟", status: "ERROR", task: "机匣分离", progress: 40, avatarColor: "bg-blue-500", error: "工具选择错误", time: "18m" },
  { id: 3, name: "金查理", status: "COMPLETED", task: "复原组装", progress: 100, avatarColor: "bg-yellow-500", time: "45m" },
  { id: 4, name: "戴安娜", status: "ACTIVE", task: "机匣分离", progress: 45, avatarColor: "bg-purple-500", time: "20m" },
  { id: 5, name: "李明", status: "IDLE", task: "预处理", progress: 15, avatarColor: "bg-green-500", time: "5m" },
  { id: 6, name: "赵强", status: "ACTIVE", task: "轴系拆解", progress: 70, avatarColor: "bg-orange-500", time: "30m" },
  { id: 7, name: "孙梅", status: "ACTIVE", task: "拆卸结合面", progress: 55, avatarColor: "bg-teal-500", time: "22m" },
  { id: 8, name: "周涛", status: "ACTIVE", task: "拆卸观察盖", progress: 25, avatarColor: "bg-indigo-500", time: "8m" },
];

const MOCK_LOGS = [
  { time: "10:42:15", student: "陈小丽", action: "成功拆除 输出轴组件", type: "success" },
  { time: "10:41:58", student: "张伟", action: "尝试用螺丝刀拆卸 M10 螺栓", type: "error" },
  { time: "10:41:20", student: "戴安娜", action: "完成步骤: 拆卸透气帽", type: "info" },
  { time: "10:40:45", student: "赵强", action: "进入 轴系拆解 场景", type: "info" },
  { time: "10:40:10", student: "金查理", action: "完成所有实训任务", type: "success" },
  { time: "10:39:22", student: "李明", action: "开始实训: 预处理", type: "info" },
  { time: "10:38:15", student: "孙梅", action: "查看知识图谱: 减速器结构", type: "info" },
];

const ERROR_DISTRIBUTION = [
  { name: '工具错误', value: 12 },
  { name: '顺序颠倒', value: 8 },
  { name: '零件遗漏', value: 5 },
  { name: '安全违规', value: 2 },
];

// Analysis Mock Data
const PROGRESS_TREND = [
  { time: '10:00', avg: 0, active: 5 },
  { time: '10:10', avg: 15, active: 38 },
  { time: '10:20', avg: 35, active: 42 },
  { time: '10:30', avg: 55, active: 42 },
  { time: '10:40', avg: 72, active: 40 },
  { time: '10:50', avg: 85, active: 38 },
];

const SKILL_DISTRIBUTION = [
  { name: '优秀 (90+)', value: 12, color: '#10B981' },
  { name: '良好 (75-89)', value: 18, color: '#3B82F6' },
  { name: '及格 (60-74)', value: 8, color: '#F59E0B' },
  { name: '需辅导 (<60)', value: 4, color: '#EF4444' },
];

const AVATAR_COLORS = ["bg-pink-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-green-500", "bg-orange-500", "bg-teal-500", "bg-indigo-500"];

export const TeacherStats: React.FC<Props> = ({ stats, chatHistory }) => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [recordingScore, setRecordingScore] = useState('');
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'ANALYSIS'>('MONITOR');

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newStudent: Student = {
      id: Date.now(),
      name: newStudentName,
      status: "IDLE",
      task: "等待开始",
      progress: 0,
      avatarColor: randomColor,
      time: "0m"
    };

    setStudents([newStudent, ...students]);
    setNewStudentName('');
    setIsModalOpen(false);
  };

  const submitScore = () => {
      alert(`评分成功！分值：${recordingScore}`);
      setRecordingScore('');
  };

  return (
    <div className="h-full w-full bg-slate-950 text-slate-200 p-8 overflow-y-auto relative">
      
      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-800/50">
                    <h3 className="text-lg font-bold text-white">添加新学员</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">学员姓名</label>
                        <input 
                            type="text" 
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                            placeholder="请输入姓名..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            autoFocus
                        />
                    </div>
                    <div className="bg-blue-900/20 border border-blue-900/30 rounded-lg p-3">
                        <p className="text-xs text-blue-300 flex items-center gap-2">
                            <Activity size={14} />
                            新学员添加后将默认处于 "IDLE" (空闲) 状态。
                        </p>
                    </div>
                </div>
                <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleAddStudent}
                        disabled={!newStudentName.trim()}
                        className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition-all"
                    >
                        确认添加
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Header Info with Tabs */}
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                {activeTab === 'MONITOR' ? <Activity className="text-blue-500 w-8 h-8" /> : <BarChart2 className="text-purple-500 w-8 h-8" />}
                {activeTab === 'MONITOR' ? '实训监控中心' : '深度教学数据分析'}
            </h2>
            <p className="text-slate-400 mt-2 font-mono text-sm">
                班级: 2024级 航空维修 A班 | 课程代码: AM-201 | 实训模块: 减速器拆装
            </p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={() => setActiveTab('ANALYSIS')}
                className={`px-4 py-2 rounded-lg text-sm border flex items-center gap-2 transition-all ${activeTab === 'ANALYSIS' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/50 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
             >
                <TrendingUp size={16} /> 数据分析
             </button>
             <button 
                onClick={() => setActiveTab('MONITOR')}
                className={`px-4 py-2 rounded-lg text-sm border flex items-center gap-2 transition-all ${activeTab === 'MONITOR' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
             >
                <Activity size={16} /> 实时监控
             </button>
        </div>
      </div>

      {/* Content Switching */}
      {activeTab === 'MONITOR' ? (
        <>
            {/* Pending Reviews Section - Only shows if recording exists */}
            {stats.recentRecordingUrl && (
                <div className="mb-8 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-xl animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                            <Mic className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">待批改作业：费曼学习法录音</h3>
                            <p className="text-indigo-300 text-sm">来自学员：当前操作学员</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <div className="flex-1">
                            <audio controls src={stats.recentRecordingUrl} className="w-full h-10 opacity-90" />
                        </div>
                        
                        <div className="w-px h-10 bg-slate-700"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" size={16} />
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    placeholder="0-100" 
                                    value={recordingScore}
                                    onChange={(e) => setRecordingScore(e.target.value)}
                                    className="bg-slate-950 border border-slate-600 rounded-lg py-2 pl-9 pr-3 text-white w-24 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <button 
                                onClick={submitScore}
                                disabled={!recordingScore}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
                            >
                                提交评分
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* ... existing metrics cards ... */}
                 <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/30 p-5 rounded-xl flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div>
                        <p className="text-indigo-300 text-xs uppercase font-bold tracking-wider mb-1">当前学员理论考核</p>
                        <div className="text-3xl font-mono font-bold text-white">
                            {stats.quizScore !== undefined && stats.quizScore > 0 ? stats.quizScore + '%' : '-'}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">同步自学生端</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <BrainCircuit className="text-indigo-400" />
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">平均进度</p>
                        <div className="text-3xl font-mono font-bold text-emerald-400">{MOCK_CLASS_STATS.avgProgress}%</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-emerald-500" />
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">实操准确率</p>
                        <div className="text-3xl font-mono font-bold text-yellow-400">{stats.accuracy}%</div>
                         <p className="text-xs text-slate-500 mt-1">当前会话</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <Activity className="text-yellow-500" />
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
                    {MOCK_CLASS_STATS.activeAlerts > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
                    <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">异常告警</p>
                        <div className="text-3xl font-mono font-bold text-red-400">{MOCK_CLASS_STATS.activeAlerts}</div>
                    </div>
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-red-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Left Column: Student Grid */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                    {/* ... existing grid header ... */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users size={20} className="text-slate-400" /> 
                            学员实时状态
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="搜索学员..." 
                                    className="bg-slate-950 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 w-48 transition-colors"
                                />
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all shadow-lg shadow-blue-900/40"
                            >
                                <Plus size={14} />
                                添加学员
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-2">
                        {students.map(student => (
                            <div key={student.id} className={`bg-slate-950 border ${student.status === 'ERROR' ? 'border-red-900/50' : student.status === 'COMPLETED' ? 'border-emerald-900/50' : 'border-slate-800'} p-4 rounded-lg relative hover:bg-slate-800 transition-colors group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {student.status === 'ERROR' && <AlertTriangle size={16} className="absolute top-4 right-4 text-red-500 animate-pulse" />}
                                {student.status === 'COMPLETED' && <CheckCircle size={16} className="absolute top-4 right-4 text-emerald-500" />}
                                
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-inner`}>
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-200">{student.name}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded inline-block mt-0.5
                                            ${student.status === 'ACTIVE' ? 'bg-blue-900/50 text-blue-300' : 
                                              student.status === 'ERROR' ? 'bg-red-900/50 text-red-300' :
                                              student.status === 'COMPLETED' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                                            {student.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>当前任务: {student.task}</span>
                                        <span>{student.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                                        <div 
                                            className={`h-1.5 rounded-full ${student.status === 'ERROR' ? 'bg-red-500' : student.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                            style={{width: `${student.progress}%`}}
                                        ></div>
                                    </div>
                                    {student.error && (
                                        <p className="text-xs text-red-400 flex items-center gap-1 mt-2">
                                            <AlertTriangle size={10} />
                                            {student.error}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-800/50">
                                        <Clock size={10} /> 耗时: {student.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Logs & Charts */}
                <div className="space-y-6 flex flex-col h-full">
                    {/* Real-time Log */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1 flex flex-col min-h-0">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <List size={20} className="text-slate-400" />
                            实时日志
                        </h3>
                        <div className="overflow-y-auto space-y-4 pr-2 font-mono text-xs flex-1">
                            {/* Render Chat Messages as Logs */}
                            {chatHistory.slice().reverse().map((msg) => (
                                <div key={msg.id} className="flex gap-3 items-start relative pl-4 border-l border-slate-800 pb-1 animate-in slide-in-from-right-4 duration-300">
                                    <div className={`absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full ${msg.role === 'STUDENT' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                                    <span className="text-slate-500 shrink-0">{msg.time}</span>
                                    <div className="text-slate-300">
                                        <span className={`font-bold mr-2 ${msg.role === 'STUDENT' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                            {msg.sender === '我' ? '当前学员' : msg.sender}
                                        </span>
                                        <span className="text-slate-400 flex gap-1 items-start">
                                            <MessageSquare size={12} className="mt-0.5 opacity-70" /> 
                                            {msg.text}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Inject current user quiz result log if available */}
                            {stats.quizScore !== undefined && stats.quizScore > 0 && (
                                <div className="flex gap-3 items-start relative pl-4 border-l border-slate-800 pb-1">
                                    <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-slate-500 shrink-0">Just Now</span>
                                    <div className="text-slate-300">
                                        <span className="font-bold mr-2 text-blue-400">Current User</span>
                                        完成理论考核，得分: {stats.quizScore}
                                    </div>
                                </div>
                            )}
                            
                            {MOCK_LOGS.map((log, i) => (
                                <div key={`log-${i}`} className="flex gap-3 items-start relative pl-4 border-l border-slate-800 pb-1 opacity-60">
                                    <div className={`absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full ${log.type === 'error' ? 'bg-red-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                    <span className="text-slate-500 shrink-0">{log.time}</span>
                                    <div className="text-slate-300">
                                        <span className={`font-bold mr-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                            {log.student}
                                        </span>
                                        {log.action}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Error Analysis Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-1/2 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-red-400" />
                            错误频率分布
                        </h3>
                        <div className="flex-1 w-full h-full min-h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ERROR_DISTRIBUTION} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" stroke="#64748b" fontSize={10} />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={60} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px' }} 
                                        cursor={{ fill: '#1e293b' }}
                                    />
                                    <Bar dataKey="value" fill="#F87171" radius={[0, 4, 4, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
      ) : (
        /* ANALYSIS TAB CONTENT */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Learning Curve Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-emerald-400" size={24} /> 
                        班级学习曲线趋势
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                        平均完成度 (Avg) 与 活跃人数 (Active) 实时对比
                    </p>
                </div>
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PROGRESS_TREND}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                            <YAxis yAxisId="left" stroke="#10B981" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" stroke="#6366f1" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="avg" name="平均完成度 %" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            <Line yAxisId="right" type="monotone" dataKey="active" name="活跃人数" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Skill Distribution Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PieChartIcon className="text-purple-400" size={24} /> 
                        综合技能掌握分布
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                        基于实操准确率、理论考核及费曼讲解评分
                    </p>
                </div>
                <div className="flex-1 min-h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={SKILL_DISTRIBUTION}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {SKILL_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                                formatter={(value, entry: any) => <span className="text-slate-300 ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Bottom: Detailed Summary Stats */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-950 rounded-lg">
                    <div className="text-sm text-slate-500 mb-1">本次实训总时长</div>
                    <div className="text-2xl font-mono text-white">45m 20s</div>
                </div>
                <div className="text-center p-4 bg-slate-950 rounded-lg">
                     <div className="text-sm text-slate-500 mb-1">班级平均得分</div>
                     <div className="text-2xl font-mono text-blue-400">86.5</div>
                </div>
                <div className="text-center p-4 bg-slate-950 rounded-lg">
                     <div className="text-sm text-slate-500 mb-1">高频错误点</div>
                     <div className="text-lg font-bold text-red-400">M6 螺栓拆卸顺序</div>
                </div>
                <div className="text-center p-4 bg-slate-950 rounded-lg">
                     <div className="text-sm text-slate-500 mb-1">技能达标率</div>
                     <div className="text-2xl font-mono text-emerald-400">92%</div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
