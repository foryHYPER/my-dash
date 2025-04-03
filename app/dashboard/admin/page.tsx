import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Benutzer</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Verwalte Benutzer im System</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Einstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Systemeinstellungen konfigurieren</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Systemstatistiken anzeigen</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 