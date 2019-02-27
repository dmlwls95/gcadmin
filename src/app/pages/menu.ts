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
                path: 'charts-check',
                title: '저자 조회 및 등록'  
            }
        ]
    },
    {
        path: 'form',
        title: '도서 관리',
        icon: 'book',
        children: [
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
                path: 'royalties-check',
                title: '일일 인세 정산 현황'
            },
            {
                path: 'royalties-period',
                title: '기간별 인세 정산'
            },
            {
                path: 'royaltie-payed',
                title: '인세 지급 현황'
            }
        ]
    },
    {
        path: 'upload',
        title: '업로드',
        icon: 'upload',
        children: [
            {
                path: 'charts-upload',
                title: '저자 데이터 업로드'
            },
            {
                path: 'book-upload',
                title: '도서 데이터 업로드'
            },
            {
                path: 'contract-upload',
                title: '계약 조건 업로드'
            },
            {
                path: 'royalties-upload',
                title: '인세 데이터 업로드'
            }
        ]
    }
];