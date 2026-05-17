import express from 'express'

import {
    createLead,
    deleteLead,
    getLeads,
    getSingleLead,
    updateLead,
} from '../controllers/lead.controller'

import { protect } from '../middleware/auth.middleware'
import { authorizeRoles } from '../middleware/role.middleware'

const router = express.Router()

router.use(protect)

router.get('/', getLeads)

router.get('/:id', getSingleLead)

router.post(
    '/',
    authorizeRoles('admin'),
    createLead
)

router.put(
    '/:id',
    authorizeRoles('admin'),
    updateLead
)

router.delete(
    '/:id',
    authorizeRoles('admin'),
    deleteLead
)

export default router