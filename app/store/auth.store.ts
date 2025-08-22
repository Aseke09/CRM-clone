interface User {
    email: string
    name: string
    status: boolean
    id: string
}

const initialState: {user: User} = {
    user: {
        email: "",
        name: "",
        status: false,
        id: ""
    }
}

export const useAuthStore = defineStore("auth", {
    state: () => initialState,
    getters: {
        currentUser: state => state.user,
    },
    actions: {
        set(user: User) {
            this.$patch({ user })
        },
        clear() {
            this.$patch( initialState )
        }
    }
})