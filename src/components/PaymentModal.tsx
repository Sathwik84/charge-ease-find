
import { useState } from 'react';
import { X, CreditCard, Calendar, Clock, Zap, IndianRupee, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: any;
}

const PaymentModal = ({ isOpen, onClose, station }: PaymentModalProps) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [duration, setDuration] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1); // 1: Booking, 2: Payment, 3: Confirmation

  if (!isOpen || !station) return null;

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const totalCost = duration * station.pricePerKwh * 25; // Assuming 25kWh per hour

  const handleBooking = () => {
    if (step === 1 && selectedSlot) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      // Here you would integrate with actual payment gateway
      setTimeout(() => {
        onClose();
        setStep(1);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Charging Slot</h2>
              <p className="text-gray-600">{station.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Station Info */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{station.name}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{station.distance} km away</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{station.address}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Available
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500">Available Chargers:</span>
                      <div className="font-medium">{station.availableChargers}/{station.totalChargers}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-medium text-green-600 flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {station.pricePerKwh}/kWh
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Slot Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Select Time Slot
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSlot(slot)}
                      className={selectedSlot === slot ? 
                        "bg-gradient-to-r from-blue-500 to-green-500 text-white" : 
                        "hover:bg-blue-50"
                      }
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  Charging Duration
                </h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold px-4">{duration} hours</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDuration(Math.min(8, duration + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Cost Summary */}
              <Card className="bg-gray-50 border-0">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span>₹{station.pricePerKwh}/kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Usage:</span>
                      <span>{duration * 25} kWh</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total Cost:</span>
                      <span className="text-green-600">₹{totalCost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleBooking}
                disabled={!selectedSlot}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 text-lg font-semibold"
              >
                Proceed to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Payment Details</h3>
                <p className="text-gray-600">Complete your booking payment</p>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="font-semibold mb-3">Payment Method</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'card', name: 'Card', icon: CreditCard },
                    { id: 'upi', name: 'UPI', icon: CreditCard },
                    { id: 'wallet', name: 'Wallet', icon: CreditCard }
                  ].map(({ id, name, icon: Icon }) => (
                    <Button
                      key={id}
                      variant={paymentMethod === id ? "default" : "outline"}
                      onClick={() => setPaymentMethod(id)}
                      className={`flex flex-col p-4 h-auto ${
                        paymentMethod === id ? 
                        "bg-gradient-to-r from-blue-500 to-green-500 text-white" : 
                        "hover:bg-blue-50"
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span>{name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" className="w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <Input placeholder="123" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <Input placeholder="John Doe" />
                </div>
              </div>

              {/* Order Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Time Slot:</span>
                      <span className="font-medium">{selectedSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{duration} hours</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-green-600">₹{totalCost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleBooking}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                >
                  Pay ₹{totalCost}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your charging slot has been successfully booked.</p>
              </div>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-left">
                  <h4 className="font-semibold mb-2">Booking Details:</h4>
                  <div className="text-sm space-y-1">
                    <div>Station: {station.name}</div>
                    <div>Time: {selectedSlot}</div>
                    <div>Duration: {duration} hours</div>
                    <div>Amount Paid: ₹{totalCost}</div>
                    <div>Booking ID: #CE{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                  </div>
                </CardContent>
              </Card>
              <p className="text-sm text-gray-500">
                You will receive a confirmation SMS/email shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
