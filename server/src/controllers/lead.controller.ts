import { Request, Response } from 'express'

import Lead from '../models/lead.model'
import { IUser } from '../models/user.model'

interface AuthRequest extends Request {
  user?: IUser
}

export const createLead = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { name, email, status, source } = req.body

        const lead = await Lead.create({
            name,
            email,
            status,
            source,
            createdBy: req.user?._id,
        })

        return res.status(201).json(lead)
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
        })
    }
}

export const getLeads = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            status,
            source,
            search,
            sort = 'latest',
            page = '1',
        } = req.query

        const limit = 10
        const currentPage = Number(page)

        const query: any = {}

        if (status) {
            query.status = status
        }

        if (source) {
            query.source = source
        }

        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ]
        }

        const sortOption: { createdAt: 1 | -1 } =
            sort === 'oldest'
                ? { createdAt: 1 }
                : { createdAt: -1 }

        const total = await Lead.countDocuments(query)

        const leads = await Lead.find(query)
            .sort(sortOption)
            .skip((currentPage - 1) * limit)
            .limit(limit)

        return res.status(200).json({
            leads,
            total,
            currentPage,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
        })
    }
}

export const getSingleLead = async (
    req: Request,
    res: Response
) => {
    try {
        const lead = await Lead.findById(req.params.id)

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found',
            })
        }

        return res.status(200).json(lead)
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
        })
    }
}

export const updateLead = async (
    req: Request,
    res: Response
) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        )

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found',
            })
        }

        return res.status(200).json(lead)
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
        })
    }
}

export const deleteLead = async (
    req: Request,
    res: Response
) => {
    try {
        const lead = await Lead.findById(req.params.id)

        if (!lead) {
            return res.status(404).json({
                message: 'Lead not found',
            })
        }

        await lead.deleteOne()

        return res.status(200).json({
            message: 'Lead deleted successfully',
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
        })
    }
}