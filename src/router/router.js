const routes =[
    {
        path: '/chat',
        name: 'chat',
        component:()=>import('@/components/chat/ChatView.vue')
    },
    {
        path: '/auth',
        name:'auth',
        component:()=>import('@/components/auth/AuthView.vue')
    }
]

export default routes