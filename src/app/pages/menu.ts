export let MENU_ITEM = [
    {
        path: 'index',
        title: 'Home',
        icon: 'far fa-building'
    },
    {
        path: 'charts',
        title: '저자 관리',
        icon: 'address-card',
        children: [
            {
                path: 'charts-upload',
                title: '저자 데이터 업로드'
            },
            {
                path: 'charts-check',
                title: '저자 조회 및 등록'  
            },
            {
                path: 'contract-upload',
                title: '계약 조건 업로드'
            }
        ]
    },
    {
        path: 'form',
        title: '도서 관리',
        icon: 'book',
        children: [
            {
                path: 'book-upload',
                title: '도서 데이터 업로드'
            },
            {
                path: 'book-check',
                title: '도서 조회 및 등록'
            },
        ]
    },
    {
        path: 'menu-levels',
        title: '매출 관리',
        icon: 'line-chart',
        children: [
            {
                path: 'pay-upload',
                title: '매출 데이터 업로드'
            },
            {
                path: 'pay-check',
                title: '매출 현황'
            }
        ]
    },
    {
        path: 'table',
        title: '인세 관리',
        icon: 'usd',
        children: [
            {
                path: 'royalties-upload',
                title: '인세 데이터 업로드'
            },
            {
                path: 'royalties-check',
                title: '인세 지급 현황'
            }
        ]
    }
];