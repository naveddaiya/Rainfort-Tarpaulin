import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 83850 11488"],
      action: "tel:+918385011488"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["daiyasarfaraz@gmail.com"],
      action: "mailto:daiyasarfaraz@gmail.com"
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["Sujangarh, Rajasthan", "India"],
      action: null
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sun: 9:00 AM - 6:00 PM"],
      action: null
    },
  ];

  return (
    <div id="contact" className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-background via-muted/30 to-background industrial-texture py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <Badge variant="default" className="mb-4">
              GET IN TOUCH
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
              Contact <span className="text-navy-500">Our Team</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to discuss your tarpaulin needs? Our team is here to help you find
              the perfect solution for your project.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:translate-y-[-4px] transition-transform duration-200">
                <CardHeader>
                  <div className="w-14 h-14 bg-navy-500 border-2 border-navy-600 flex items-center justify-center mx-auto mb-4 heavy-shadow">
                    <info.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-lg uppercase tracking-wider">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                  {info.action && (
                    <a
                      href={info.action}
                      className="inline-block mt-3 text-sm font-bold text-navy-500 hover:text-safety-500 transition-colors"
                    >
                      Connect →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">Send Us a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-border bg-background text-foreground focus:border-navy-500 focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-border bg-background text-foreground focus:border-navy-500 focus:outline-none transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-border bg-background text-foreground focus:border-navy-500 focus:outline-none transition-colors"
                          placeholder="+91 12345 67890"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-border bg-background text-foreground focus:border-navy-500 focus:outline-none transition-colors"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border-2 border-border bg-background text-foreground focus:border-navy-500 focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>

                    <Button type="submit" variant="accent" size="lg" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-navy-500 text-white border-navy-600">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Quick Response</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80">
                    For urgent inquiries or immediate assistance, call us directly:
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-white text-navy-500 border-white hover:bg-white/90"
                    onClick={() => window.location.href = 'tel:+918385011488'}
                  >
                    <Phone className="mr-2" size={18} />
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-safety-500 border-2 border-safety-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Quick Response</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-safety-500 border-2 border-safety-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Consultation</h4>
                      <p className="text-sm text-muted-foreground">
                        Discuss your requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-safety-500 border-2 border-safety-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Custom Quote</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive detailed pricing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
