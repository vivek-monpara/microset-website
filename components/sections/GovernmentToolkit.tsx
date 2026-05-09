import { Button } from '@/components/ui/button';
import { Check, MessageCircle } from 'lucide-react';

const TOOLKIT_BENEFITS = [
  'Complete starter toolkit for aspiring goldsmiths',
  'Approved by government vocational programs',
  'Bulk quantities available for training centers',
  'Comprehensive support and documentation',
  'Competitive wholesale pricing',
  'Free replacement warranty on defects',
];

export function GovernmentToolkit() {
  return (
    <section id="toolkit" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-medium text-primary">Government Program</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Authorized Government Toolkit Supplier
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              We are an authorized supplier for government goldsmith training programs across India. Our toolkits meet all vocational training standards and are designed for beginners and professionals alike.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {TOOLKIT_BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://wa.me/919879074051" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4" />
                  Contact for Bulk Orders
                </Button>
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden bg-muted h-96 flex items-center justify-center border border-border">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Government Toolkit"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-lg hidden md:block">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-white/80">Training Centers Supplied</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
