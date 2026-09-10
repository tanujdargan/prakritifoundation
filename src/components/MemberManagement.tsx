import { useState, useEffect } from 'react';
import { Users, Search, Filter, Download, UserCheck, UserX, MinusCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Member {
  id: string;
  member_id: string;
  name: string;
  email: string;
  phone: string;
  membership_type: string;
  status: 'active' | 'blocked' | 'inactive';
  membership_fee_paid: boolean;
  created_at: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, statusFilter, membershipFilter]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.member_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    if (membershipFilter !== 'all') {
      filtered = filtered.filter(member => member.membership_type === membershipFilter);
    }

    setFilteredMembers(filtered);
  };

  const updateMemberStatus = async (memberId: string, newStatus: 'active' | 'blocked' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.map(member =>
        member.id === memberId ? { ...member, status: newStatus } : member
      ));

      alert(`Member status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Error updating member status');
    }
  };

  const exportToExcel = () => {
    const csvContent = [
      ['Member ID', 'Name', 'Email', 'Phone', 'Membership Type', 'Status', 'Fee Paid', 'Join Date'],
      ...filteredMembers.map(member => [
        member.member_id,
        member.name,
        member.email,
        member.phone,
        member.membership_type,
        member.status,
        member.membership_fee_paid ? 'Yes' : 'No',
        new Date(member.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const statusMeta = (status: Member['status']) => {
    switch (status) {
      case 'active':
        return { label: 'active', icon: UserCheck, classes: 'bg-pf-sage text-pf-forest' };
      case 'blocked':
        return { label: 'blocked', icon: UserX, classes: 'bg-red-50 text-red-800' };
      default:
        return { label: 'inactive', icon: MinusCircle, classes: 'bg-pf-cream text-pf-muted border border-pf-border' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-10 w-10 border-2 border-pf-border border-t-pf-forest"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-pf-forest flex items-center">
          <Users className="h-6 w-6 mr-2 text-pf-moss" aria-hidden="true" />
          Member Management
        </h2>
        <button
          onClick={exportToExcel}
          className="inline-flex h-11 cursor-pointer items-center rounded-md bg-pf-forest px-4 text-sm font-medium text-white transition-colors hover:bg-pf-moss"
        >
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-pf-border p-6 rounded-lg">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="member-search" className="flex items-center text-sm font-medium text-pf-ink mb-2">
              <Search className="h-4 w-4 mr-1" aria-hidden="true" />
              Search Members
            </label>
            <input
              id="member-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
              placeholder="Search by name, email, or member ID"
            />
          </div>

          <div>
            <label htmlFor="status-filter" className="flex items-center text-sm font-medium text-pf-ink mb-2">
              <Filter className="h-4 w-4 mr-1" aria-hidden="true" />
              Status Filter
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="membership-filter" className="block text-sm font-medium text-pf-ink mb-2">
              Membership Type
            </label>
            <select
              id="membership-filter"
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value)}
              className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
            >
              <option value="all">All Types</option>
              <option value="Regular">Regular</option>
              <option value="Premium">Premium</option>
              <option value="Lifetime">Lifetime</option>
              <option value="Student">Student</option>
              <option value="Senior Citizen">Senior Citizen</option>
              <option value="Corporate">Corporate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-pf-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-pf-moss" aria-hidden="true" />
            <h3 className="text-sm font-medium text-pf-muted">Total Members</h3>
          </div>
          <p className="text-2xl font-semibold text-pf-forest">{members.length}</p>
        </div>
        <div className="bg-white border border-pf-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="h-4 w-4 text-pf-moss" aria-hidden="true" />
            <h3 className="text-sm font-medium text-pf-muted">Active Members</h3>
          </div>
          <p className="text-2xl font-semibold text-pf-forest">
            {members.filter(m => m.status === 'active').length}
          </p>
        </div>
        <div className="bg-white border border-pf-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <UserX className="h-4 w-4 text-red-700" aria-hidden="true" />
            <h3 className="text-sm font-medium text-pf-muted">Blocked Members</h3>
          </div>
          <p className="text-2xl font-semibold text-pf-forest">
            {members.filter(m => m.status === 'blocked').length}
          </p>
        </div>
        <div className="bg-white border border-pf-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-pf-marigold" aria-hidden="true" />
            <h3 className="text-sm font-medium text-pf-muted">Fee Pending</h3>
          </div>
          <p className="text-2xl font-semibold text-pf-forest">
            {members.filter(m => !m.membership_fee_paid).length}
          </p>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-pf-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-pf-border">
            <thead className="bg-pf-sage/40">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-pf-border">
              {filteredMembers.map((member) => {
                const { label, icon: StatusIcon, classes } = statusMeta(member.status);
                return (
                  <tr key={member.id} className="hover:bg-pf-sage/20">
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-pf-ink">{member.name}</div>
                      <div className="text-sm text-pf-muted">{member.member_id}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-pf-ink">{member.email}</div>
                      <div className="text-sm text-pf-muted">{member.phone}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-pf-ink">{member.membership_type}</div>
                      <div className="text-sm text-pf-muted">
                        Fee: {member.membership_fee_paid ? 'Paid' : 'Pending'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${classes}`}>
                        <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        {label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">
                      {member.status === 'active' ? (
                        <button
                          onClick={() => updateMemberStatus(member.id, 'blocked')}
                          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 text-red-800 transition-colors hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4" aria-hidden="true" />
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => updateMemberStatus(member.id, 'active')}
                          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-pf-border px-3 text-pf-forest transition-colors hover:bg-pf-sage/40"
                        >
                          <UserCheck className="h-4 w-4" aria-hidden="true" />
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-pf-border mx-auto mb-4" aria-hidden="true" />
            <p className="text-pf-muted">No members found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManagement;
