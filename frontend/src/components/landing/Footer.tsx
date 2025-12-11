import { Shield, Github, FileText, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AegisPay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered fraud detection platform protecting transactions in real-time.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <FileText className="h-4 w-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Github className="h-4 w-4" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:contact@aegispay.demo" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  contact@aegispay.demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>AegisPay Demo Platform. Built for fraud detection demonstration.</p>
        </div>
      </div>
    </footer>
  );
}
