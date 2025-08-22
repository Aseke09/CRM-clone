<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useMutation } from '@tanstack/vue-query'
import { COLLECTION_DEALS, DB_ID } from '~/constants'
import { DATABASE, UNIQUE_ID } from '~/libs/appwrite'
import { useAuthStore } from '~/store/auth.store'
import type { ICreateDeals } from '~/types'
import { ref, reactive } from 'vue'

const props = defineProps({
	status: {
		type: String,
		required: true,
	},
	refetch: {
		type: Function,
		required: true,
	},
})

const toast = useToast()
const { currentUser } = useAuthStore()
const isOpen = ref(false)

const state = reactive({
	name: '',
	description: '',
})

function handleClickOutside(event: MouseEvent) {
	const popover = document.querySelector('.popover-container') 
	if (popover && !popover.contains(event.target as Node)) {
		isOpen.value = false
	}
}

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.name) errors.push({ path: 'name', message: 'Name is requierd' })
	if (!state.description) errors.push({ path: 'description', message: 'Description is required' })
	return errors
}

const { isPending, mutate } = useMutation({
	mutationKey: ['create-deal'],
	mutationFn: (data: ICreateDeals) => 
	  DATABASE.createDocument(DB_ID, COLLECTION_DEALS, UNIQUE_ID, data),
	onSuccess: () => {
		props.refetch()
		state.name = ''
		state.description = ''
		isOpen.value = false
		toast.add({ title: 'Success', description: 'Deal created successfully' })
	},
	onError: () => {
		toast.add({ title: 'Error', description: 'Something went wrong', color: 'error' })
	},
})

async function onSubmit(event: FormSubmitEvent<any>) {
	const { name, description } = event.data

	mutate({ name, description, status: props.status, userId: currentUser.id })
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
	<div class="popover-container relative">
		<UPopover 
		  :open="isOpen" 
		  :content="{ side: 'bottom', align: 'center' }" 
		   
		>
			<UButton
				variant="ghost"
				class="opacity-75 hover:opacity-100 mx-auto mt-3"
				color="info"
				@click.stop="isOpen = !isOpen"
			>
				<Icon name="radix-icons:plus-circled" size="35" />
			</UButton>

			<template #content>
				<div class="p-4 w-80 dark:bg-gray-900 bg-gray-100" @click.stop>
					<UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
						<UFormField label="Name" name="name">
							<UInput v-model="state.name" color="info" class="w-full" />
						</UFormField>

						<UFormField label="Description" name="description">
							<UTextarea v-model="state.description" color="info" class="w-full" />
						</UFormField>

						<UButton type="submit" color="info" class="w-full" block size="lg" :disabled="isPending">
							<template v-if="isPending">
								<Icon name="svg-spinners:3-dots-fade" class="w-5 h-5" />
							</template>
							<template v-else>Submit</template>
						</UButton>
					</UForm>
				</div>
			</template>
		</UPopover>
	</div>
</template>