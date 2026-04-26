
const NAV_LINKS = [
    {
        icon: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        iconFill: true
    },
    {
        icon: 'group',
        label: 'Students',
        path: '/students'
    },
    {
        icon: 'event_note',
        label: 'Visits',
        path: '/visits'
    },
    {
        icon: 'medical_services',
        label: 'Treatments',
        path: '/treatments'
    },
    {
        icon: 'medication',
        label: 'Medicines',
        path: '/medicines'
    },
    {
        icon: 'description',
        label: 'Prescriptions',
        path: '/prescriptions'
    },
    {
        icon: 'assessment',
        label: 'Reports',
        path: '/reports',
        adminOnly: true
    },
    {
        icon: 'badge',
        label: 'Staff',
        path: '/staff',
        adminOnly: true
    }
];

const SIDEBAR_FOOTER_LINKS = [
    {
        icon: 'logout',
        label: 'Logout',
        path: '/'
    }
];

export {
    NAV_LINKS,
    SIDEBAR_FOOTER_LINKS
};
