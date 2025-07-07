import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Account information (name, email, billing details)",
        "Usage data (workflows created, API calls, performance metrics)",
        "Device information (browser type, IP address, operating system)",
        "Communication data (support tickets, feedback, surveys)"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Provide and improve our automation platform services",
        "Process payments and manage your subscription",
        "Send important updates and security notifications",
        "Analyze usage patterns to enhance user experience"
      ]
    },
    {
      title: "Data Protection & Security",
      icon: Shield,
      content: [
        "End-to-end encryption for all workflow data",
        "SOC 2 Type II certified infrastructure",
        "Regular security audits and penetration testing",
        "GDPR and CCPA compliant data handling"
      ]
    },
    {
      title: "Your Rights & Controls",
      icon: Lock,
      content: [
        "Access and download your personal data",
        "Correct inaccurate information",
        "Delete your account and associated data",
        "Opt-out of marketing communications"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Legal</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
              Privacy 
            </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent px-2">
              Policy
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your privacy is our priority. Learn how we <span className="text-indigo-400 font-semibold">protect your data</span> and 
            <span className="text-purple-400 font-semibold"> respect your rights</span>.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-600/50">
              Last updated: December 2024
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              GDPR Compliant
            </Badge>
          </div>
        </div>

        {/* Privacy Overview Card */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 mb-12 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-50 mb-3">Privacy at WorkFlow AI</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  We're committed to protecting your privacy and maintaining transparency about how we collect, use, and protect your information. 
                  This policy explains our practices and your rights regarding your personal data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="grid gap-8 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-0 relative">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-50 group-hover:text-indigo-100 transition-colors duration-300">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-slate-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Retention */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 mb-12 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-50 group-hover:text-amber-100 transition-colors duration-300">
                Data Retention
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              We retain your personal information only as long as necessary to provide our services and fulfill legal obligations:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-slate-300 leading-relaxed">Account data: Retained while your account is active</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-slate-300 leading-relaxed">Usage data: Anonymized after 2 years</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-slate-300 leading-relaxed">Workflow data: Deleted within 30 days of account closure</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-50 group-hover:text-emerald-100 transition-colors duration-300 mb-3">
                  Questions About Privacy?
                </h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-slate-300"><strong className="text-emerald-400">Email:</strong> raheesahmed256@gmail.com</p>
                  <p className="text-slate-300"><strong className="text-emerald-400">Address:</strong> Abbottabad, Pakistan</p>
                  <p className="text-slate-300"><strong className="text-emerald-400">Phone:</strong> +92 315 5501381</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
} 