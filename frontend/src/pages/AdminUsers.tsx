import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { RiskBadge } from '@/components/common/RiskBadge';
import type { User } from '@/types/api';
import mockUsersData from '@/mocks/mock_users.json';
import { Search, Shield, Award, AlertTriangle, User as UserIcon } from 'lucide-react';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const users = mockUsersData.users as User[];

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getKycBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return { icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'verified':
        return { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      default:
        return { icon: UserIcon, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage and monitor all platform users
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-users"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredUsers.map((user, i) => {
            const kycConfig = getKycBadge(user.kycLevel);
            const KycIcon = kycConfig.icon;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="relative inline-block mb-3">
                      <Avatar className="h-16 w-16 mx-auto">
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {user.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 p-1 rounded-full ${kycConfig.bg}`}
                      >
                        <KycIcon className={`h-3 w-3 ${kycConfig.color}`} />
                      </div>
                    </div>

                    <h3 className="font-medium truncate">{user.displayName}</h3>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {user.email.replace(/(.{3}).*@/, '$1***@')}
                    </p>

                    <div className="text-lg font-bold mb-2">
                      {formatBalance(user.balance, user.currency)}
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                      <RiskBadge score={user.riskScore} size="sm" showScore={false} />
                      <Badge variant="outline" className="text-xs">
                        {user.transactionCount} txns
                      </Badge>
                    </div>

                    {user.riskScore >= 50 && (
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-500">
                        <AlertTriangle className="h-3 w-3" />
                        Review needed
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
