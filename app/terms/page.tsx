import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Scale, 
  FileText, 
  AlertTriangle, 
  Shield,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsOfService() {
  const sections = [
    {
      title: "Account Terms",
      icon: Users,
      content: [
        "You must be 18 years or older to use our service",
        "Provide accurate and complete registration information",
        "Maintain the security of your login credentials",
        "Responsible for all activities under your account"
      ]
    },
    {
      title: "Service Usage",
      icon: Zap,
      content: [
        "Use our platform for lawful business purposes only",
        "Comply with API rate limits and usage guidelines",
        "Do not attempt to reverse engineer our software",
        "Respect intellectual property rights of third parties"
      ]
    },
    {
      title: "Payment & Billing",
      icon: CreditCard,
      content: [
        "Subscription fees are billed monthly or annually",
        "All fees are non-refundable except as required by law",
        "Price changes will be communicated 30 days in advance",
        "Failed payments may result in service suspension"
      ]
    },
    {
      title: "Data & Privacy",
      icon: Shield,
      content: [
        "We process your data according to our Privacy Policy",
        "You retain ownership of your workflow data",
        "We may use aggregated data for service improvement",
        "Data export available before account termination"
      ]
    }
  ]

  const prohibitedUses = [
    "Illegal activities or violation of laws",
    "Harassment, abuse, or harmful content",
    "Spam or unsolicited communications",
    "Malware, viruses, or malicious code",
    "Unauthorized access to systems",
    "Competing services or reverse engineering"
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-amber-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-amber-400 bg-clip-text text-transparent">Legal</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-50 via-indigo-200 to-slate-50 bg-clip-text text-transparent">
              Terms of 
            </span>
            <span className="bg-gradient-to-r from-indigo-400 via-amber-400 to-indigo-400 bg-clip-text text-transparent px-2">
              Service
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Clear and fair terms that govern your use of <span className="text-indigo-400 font-semibold">WorkFlow AI</span> platform 
            and <span className="text-amber-400 font-semibold">automation services</span>.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-600/50">
              Effective: December 2024
            </Badge>
            <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              Version 2.1
            </Badge>
          </div>
        </div>

        {/* Terms Overview Card */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 mb-12 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-50 mb-3">Agreement Overview</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  By using WorkFlow AI, you agree to these terms. These terms create a legal agreement between you and WorkFlow AI 
                  regarding your use of our automation platform and services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
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

        {/* Prohibited Uses */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 mb-12 hover:bg-slate-800/50 hover:border-red-500/30 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-50 group-hover:text-red-100 transition-colors duration-300">
                Prohibited Uses
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              The following activities are strictly prohibited when using our platform:
            </p>
            <ul className="space-y-3">
              {prohibitedUses.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="text-slate-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 mb-12 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-50 group-hover:text-amber-100 transition-colors duration-300">
                Service Availability
              </h3>
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                We strive to provide reliable service, but cannot guarantee 100% uptime. Our commitments include:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-semibold mb-2">Uptime Target</h4>
                  <p className="text-slate-300 text-sm">99.5% monthly uptime goal</p>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-semibold mb-2">Maintenance</h4>
                  <p className="text-slate-300 text-sm">Scheduled updates with advance notice</p>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-semibold mb-2">Support</h4>
                  <p className="text-slate-300 text-sm">24/7 technical support availability</p>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-amber-400 font-semibold mb-2">Data Backup</h4>
                  <p className="text-slate-300 text-sm">Daily automated backups</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-3xl p-8 mb-12 hover:bg-slate-800/50 hover:border-purple-500/30 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-0 relative">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-50 group-hover:text-purple-100 transition-colors duration-300">
                Account Termination
              </h3>
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Either party may terminate this agreement under the following conditions:
              </p>
              <div className="grid gap-4">
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">By You</h4>
                  <p className="text-slate-300 text-sm">Cancel your subscription at any time through your account settings</p>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">By Us</h4>
                  <p className="text-slate-300 text-sm">For breach of terms, non-payment, or discontinuation of service</p>
                </div>
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Data Export</h4>
                  <p className="text-slate-300 text-sm">30-day window to export your data before permanent deletion</p>
                </div>
              </div>
            </div>
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
                  Questions About Terms?
                </h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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