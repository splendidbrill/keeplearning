"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  LogOut, 
  Home, 
  BookOpen, 
  CheckCircle, 
  TrendingUp,
  Plus,
  MoreVertical,
  Clock,
  Library,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard4Content({ user }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // Mock data - replace with real data from Supabase later
  const stats = {
    subjects: 2,
    totalBooks: 2,
    completed: 0,
    progress: 0
  };

  const subjects = [
    {
      id: 1,
      name: "Tushar Karan",
      color: "bg-yellow-500",
      books: 0,
      status: "Active",
      recentBooks: [],
      progress: 0
    },
    {
      id: 2,
      name: "er",
      color: "bg-purple-500",
      books: 2,
      status: "Active",
      recentBooks: [
        { name: "hi", color: "bg-green-500" },
        { name: "or", color: "bg-red-500" }
      ],
      progress: 0
    }
  ];

  const quickActions = [
    {
      icon: Clock,
      title: "Schedule Lesson",
      description: "Set up automated learning sessions",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Library,
      title: "Browse Library",
      description: "Access all your learning materials",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: BarChart3,
      title: "View Progress",
      description: "Track your learning journey",
      gradient: "from-green-500/20 to-emerald-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LearnFlow AI Tutor</h1>
                <p className="text-sm text-slate-400">AI-Powered Learning Management System</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Subjects</span>
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.subjects}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Total Books</span>
              <Library className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalBooks}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.completed}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm">Progress</span>
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-bold text-white">{stats.progress}</p>
              <span className="text-xl text-slate-400">%</span>
            </div>
          </motion.div>
        </div>

        {/* My Subjects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Subjects</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`relative w-2.5 h-2.5 rounded-full ${subject.color}`}>
                      <div className={`absolute inset-0 rounded-full ${subject.color} animate-ping opacity-75`} />
                      <div className={`relative w-2.5 h-2.5 rounded-full ${subject.color}`} />
                    </div>
                    <h3 className="text-base font-semibold text-white">{subject.name}</h3>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-xs">{subject.books} Books</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    {subject.status}
                  </span>
                </div>

                {subject.recentBooks.length > 0 ? (
                  <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1.5">Recent Books</p>
                    <div className="space-y-1.5">
                      {subject.recentBooks.map((book, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`relative w-1.5 h-1.5 rounded-full ${book.color}`}>
                            <div className={`absolute inset-0 rounded-full ${book.color} blur-sm opacity-60`} />
                          </div>
                          <span className="text-xs text-slate-300">{book.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 py-3 text-center">
                    <p className="text-xs text-slate-500 italic">No books added yet</p>
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Book
                  </button>
                  <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-xs font-medium">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`bg-gradient-to-br ${action.gradient} backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:scale-105 transition-transform duration-300`}
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                <p className="text-sm text-slate-400">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}