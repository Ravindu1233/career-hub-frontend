import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Building2,
  GraduationCap,
  BookOpen,
  Menu,
  X,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ShieldCheck,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const navigation = [
  { name: "Home", href: "/", icon: null },
  { name: "Browse Jobs", href: "/jobs", icon: Briefcase },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Institutions", href: "/institutions", icon: GraduationCap },
  { name: "Career Guidance", href: "/guidance", icon: BookOpen },
];

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
function getDisplayName() {
  const authType = localStorage.getItem("authType");
  if (authType === "USER") {
    const raw = localStorage.getItem("user");
    if (!raw) return "User";
    try {
      const u = JSON.parse(raw);
      return u?.firstName
        ? `${u.firstName}${u.lastName ? " " + u.lastName : ""}`
        : u?.email || "User";
    } catch {
      return "User";
    }
  }
  if (authType === "COMPANY") {
    const raw = localStorage.getItem("company");
    if (!raw) return "Company";
    try {
      const c = JSON.parse(raw);
      return c?.companyName || c?.email || "Company";
    } catch {
      return "Company";
    }
  }
  if (authType === "ADMIN") {
    const raw = localStorage.getItem("admin");
    if (!raw) return "Admin";
    try {
      const a = JSON.parse(raw);
      return a?.firstName
        ? `${a.firstName}${a.lastName ? " " + a.lastName : ""}`
        : a?.email || "Admin";
    } catch {
      return "Admin";
    }
  }
  return "Account";
}

function getDashboardPath() {
  const authType = localStorage.getItem("authType");
  if (authType === "COMPANY") return "/company/dashboard";
  if (authType === "ADMIN") return "/admin/dashboard";
  return "/user/dashboard";
}

function timeAgo(dateString: string) {
  const d = new Date(dateString);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
  url?: string;
  path?: string;
  jobId?: string;
  applicationId?: string;
  interviewId?: string;
};

function getNotificationTarget(notification: Notification, authType: string) {
  const directPath = notification.link || notification.url || notification.path;
  if (directPath && directPath.startsWith("/")) return directPath;

  const type = (notification.type || "").toLowerCase();
  const jobId = notification.jobId;
  const applicationId = notification.applicationId;
  const applicationsPath =
    authType === "COMPANY" ? "/company/applications" : "/user/applications";

  if (jobId && (type.includes("job") || type.includes("application"))) {
    return `/jobs/${jobId}`;
  }

  if (applicationId && type.includes("application")) {
    return applicationsPath;
  }

  if (type.includes("interview")) {
    return applicationsPath;
  }

  if (type.includes("application")) {
    return applicationsPath;
  }

  return null;
}

// ─────────────────────────────────────────
// Notification Bell Component
// ─────────────────────────────────────────
function NotificationBell({ authType }: { authType: string }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endpoint =
    authType === "COMPANY" ? "/notifications/company" : "/notifications/user";

  const fetchNotifications = async () => {
    try {
      const res = await api.get(endpoint);
      const data: Notification[] = res.data ?? [];
      setNotifications(data.slice(0, 10)); // show latest 10
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch {
      // silently ignore — token may have expired
    }
  };

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, 30_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [authType]);

  const markAllRead = async () => {
    try {
      await api.patch(`${endpoint}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markOneRead = async (id: string) => {
    try {
      await api.patch(`${endpoint}/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const deleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.delete(`${endpoint}/${id}`);
      const wasUnread = notifications.find((n) => n.id === id)?.read === false;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markOneRead(notification.id);
    }
    setOpen(false);
    const target = getNotificationTarget(notification, authType);
    if (target) {
      navigate(target);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <CheckCheck className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                  !n.read && "bg-primary/5",
                )}
              >
                {/* Unread dot */}
                <div className="mt-1.5 shrink-0">
                  {!n.read ? (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm", !n.read && "font-medium")}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => deleteOne(e, n.id)}
                  className="shrink-0 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─────────────────────────────────────────
// Main Navbar
// ─────────────────────────────────────────
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token"),
  );

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    window.addEventListener("focus", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const authType = localStorage.getItem("authType") ?? "";
  const isAdmin = authType === "ADMIN";

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authType");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    localStorage.removeItem("admin");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const dashboardPath = getDashboardPath();
  const displayName = getDisplayName();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={handleNavClick}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Career<span className="text-primary">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {isLoggedIn ? (
              <>
                {/* ✅ Real notification bell — hide for admin */}
                {!isAdmin && isLoggedIn && (
                  <NotificationBell authType={authType} />
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {isAdmin ? (
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{displayName}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        to={dashboardPath}
                        onClick={handleNavClick}
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    {!isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            to={
                              authType === "COMPANY"
                                ? "/company/applications"
                                : "/user/applications"
                            }
                            onClick={handleNavClick}
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            My Applications
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/settings"
                            onClick={handleNavClick}
                            className="flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" onClick={handleNavClick}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" onClick={handleNavClick}>
                    Post a Job
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-slide-up">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                {item.name}
              </Link>
            ))}

            <div className="pt-4 space-y-2">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" onClick={handleNavClick}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={handleNavClick}>
                    <Button className="w-full">Post a Job</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={dashboardPath} onClick={handleNavClick}>
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
