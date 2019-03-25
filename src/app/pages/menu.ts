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
                title: '저자정보등록'  
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
                title: '도서정보 조회 및 등록'
            }
        ]
    },
    {
        path: 'menu-levels',
        title: '매출 관리',
        icon: 'line-chart',
        children: [
            {
                path: 'pay-upload',
                title: '데이터 업로드'
            },
            {
                path: 'pay-check',
                title: '매출 조회'
            }
        ]
    },
    {
        path: 'table',
        title: '인세 지급 관리',
        icon: 'usd',
        children: [
            {
                path: 'royalties-check',
                title: '인세 정산 관리'
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