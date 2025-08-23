"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, PartyPopper } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartData {
  year: number
  invested: number
  value: number
  returns: number
}

export default function SipCalculatorPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000)
  const [lumpsum, setLumpsum] = useState(100000)
  const [annualReturn, setAnnualReturn] = useState(12)
  const [years, setYears] = useState(10)
  const [frequency, setFrequency] = useState("monthly")
  const [activeTab, setActiveTab] = useState("sip")

  const [sipResult, setSipResult] = useState({ totalInvested: 0, finalAmount: 0, totalReturns: 0 })
  const [lumpsumResult, setLumpsumResult] = useState({ totalInvested: 0, finalAmount: 0, totalReturns: 0 })
  const [chartData, setChartData] = useState<ChartData[]>([])

  const calculateSIP = () => {
    const monthlyRate = annualReturn / 100 / 12
    const totalMonths = years * 12
    const paymentsPerYear = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 1
    const paymentAmount =
      frequency === "monthly" ? monthlyAmount : frequency === "quarterly" ? monthlyAmount * 3 : monthlyAmount * 12
    const ratePerPayment = annualReturn / 100 / paymentsPerYear
    const totalPayments = years * paymentsPerYear

    // SIP formula: M * [((1 + r)^n - 1) / r] * (1 + r)
    const finalAmount =
      paymentAmount * (((Math.pow(1 + ratePerPayment, totalPayments) - 1) / ratePerPayment) * (1 + ratePerPayment))
    const totalInvested = paymentAmount * totalPayments
    const totalReturns = finalAmount - totalInvested

    setSipResult({ totalInvested, finalAmount, totalReturns })

    // Generate chart data
    const data: ChartData[] = []
    for (let year = 1; year <= years; year++) {
      const paymentsThisYear = year * paymentsPerYear
      const investedThisYear = paymentAmount * paymentsThisYear
      const valueThisYear =
        paymentAmount * (((Math.pow(1 + ratePerPayment, paymentsThisYear) - 1) / ratePerPayment) * (1 + ratePerPayment))
      const returnsThisYear = valueThisYear - investedThisYear

      data.push({
        year,
        invested: Math.round(investedThisYear),
        value: Math.round(valueThisYear),
        returns: Math.round(returnsThisYear),
      })
    }
    setChartData(data)
  }

  const calculateLumpsum = () => {
    const finalAmount = lumpsum * Math.pow(1 + annualReturn / 100, years)
    const totalReturns = finalAmount - lumpsum

    setLumpsumResult({ totalInvested: lumpsum, finalAmount, totalReturns })

    // Generate chart data for lumpsum
    const data: ChartData[] = []
    for (let year = 1; year <= years; year++) {
      const valueThisYear = lumpsum * Math.pow(1 + annualReturn / 100, year)
      const returnsThisYear = valueThisYear - lumpsum

      data.push({
        year,
        invested: lumpsum,
        value: Math.round(valueThisYear),
        returns: Math.round(returnsThisYear),
      })
    }
    setChartData(data)
  }

  useEffect(() => {
    if (activeTab === "sip") {
      calculateSIP()
    } else {
      calculateLumpsum()
    }
  }, [monthlyAmount, lumpsum, annualReturn, years, frequency, activeTab])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const currentResult = activeTab === "sip" ? sipResult : lumpsumResult

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10">
        <header className="container mx-auto px-6 py-12">
          <Link
            href="/finance-tools"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Finance Tools
          </Link>
          <div className="text-center">
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              SIP Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate returns for systematic investment plans and lumpsum investments
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
              <TabsTrigger value="lumpsum">Lumpsum Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="sip" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>SIP Details</CardTitle>
                    <CardDescription>Enter your investment parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyAmount">Monthly Investment Amount</Label>
                      <Input
                        id="monthlyAmount"
                        type="number"
                        value={monthlyAmount}
                        onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequency">Investment Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
                      <Input
                        id="annualReturn"
                        type="number"
                        value={annualReturn}
                        onChange={(e) => setAnnualReturn(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years">Investment Period (Years)</Label>
                      <Input
                        id="years"
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-blue-600 mb-2">Total Invested</p>
                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(sipResult.totalInvested)}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-green-600 mb-2">Total Returns</p>
                        <p className="text-2xl font-bold text-green-700">{formatCurrency(sipResult.totalReturns)}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <PartyPopper className="w-5 h-5" />
                          <p className="text-sm">Final Amount</p>
                        </div>
                        <p className="text-3xl font-black">{formatCurrency(sipResult.finalAmount)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Investment Growth Chart
                      </CardTitle>
                      <CardDescription>Track your investment growth over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          invested: {
                            label: "Total Invested",
                            color: "hsl(var(--chart-1))",
                          },
                          value: {
                            label: "Portfolio Value",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[400px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="invested"
                              stroke="var(--color-invested)"
                              strokeWidth={3}
                              name="Total Invested"
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="var(--color-value)"
                              strokeWidth={3}
                              name="Portfolio Value"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lumpsum" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Lumpsum Investment</CardTitle>
                    <CardDescription>Enter your one-time investment details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="lumpsum">Investment Amount</Label>
                      <Input
                        id="lumpsum"
                        type="number"
                        value={lumpsum}
                        onChange={(e) => setLumpsum(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
                      <Input
                        id="annualReturn"
                        type="number"
                        value={annualReturn}
                        onChange={(e) => setAnnualReturn(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years">Investment Period (Years)</Label>
                      <Input
                        id="years"
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-blue-600 mb-2">Initial Investment</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {formatCurrency(lumpsumResult.totalInvested)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-6 text-center">
                        <p className="text-sm text-green-600 mb-2">Total Returns</p>
                        <p className="text-2xl font-bold text-green-700">
                          {formatCurrency(lumpsumResult.totalReturns)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <PartyPopper className="w-5 h-5" />
                          <p className="text-sm">Final Amount</p>
                        </div>
                        <p className="text-3xl font-black">{formatCurrency(lumpsumResult.finalAmount)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Investment Growth Chart
                      </CardTitle>
                      <CardDescription>Track your lumpsum investment growth over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          invested: {
                            label: "Initial Investment",
                            color: "hsl(var(--chart-1))",
                          },
                          value: {
                            label: "Portfolio Value",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-[400px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="invested"
                              stroke="var(--color-invested)"
                              strokeWidth={3}
                              name="Initial Investment"
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="var(--color-value)"
                              strokeWidth={3}
                              name="Portfolio Value"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
