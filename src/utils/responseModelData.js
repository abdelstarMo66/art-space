exports.artistData = (artist) => {
    return {
        id: artist._id,
        name: artist.name,
        email: artist.email,
        phone: artist.phone,
        imageId: artist.profileImg.public_id,
        profileImg: artist.profileImg.secure_url ?? null,
        gender: artist.gender ?? null,
        accountActive: artist.accountActive,
        addresses: artist.addresses.map(address => {
            return {
                id: address._id,
                alias: address.alias,
                street: address.street,
                region: address.region,
                city: address.city,
                country: address.country,
                postalCode: address.postalCode ?? null,
                phone: address.phone ?? null,
            }
        }),
    }
}

exports.allArtistData = (artists) => {
    return artists.map(artist => {
        return {
            id: artist._id,
            name: artist.name,
            email: artist.email,
            phone: artist.phone,
            gender: artist.gender ?? null,
            accountActive: artist.accountActive,
            addresses: artist.addresses.map(address => {
                return {
                    id: address._id,
                    alias: address.alias,
                    street: address.street,
                    region: address.region,
                    city: address.city,
                    country: address.country,
                    postalCode: address.postalCode ?? null,
                    phone: address.phone ?? null,
                }
            }),
        }
    });
}

exports.userData = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        imageId: user.profileImg.public_id,
        profileImg: user.profileImg.secure_url ?? null,
        gender: user.gender ?? null,
        accountActive: user.accountActive,
        addresses: user.addresses.map(address => {
            return {
                id: address._id,
                alias: address.alias,
                street: address.street,
                region: address.region,
                city: address.city,
                country: address.country,
                postalCode: address.postalCode ?? null,
                phone: address.phone ?? null,
            }
        }),
    }
}

exports.allUserData = (users) => {
    return users.map(user => {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender ?? null,
            accountActive: user.accountActive,
            addresses: user.addresses.map(address => {
                return {
                    id: address._id,
                    alias: address.alias,
                    street: address.street,
                    region: address.region,
                    city: address.city,
                    country: address.country,
                    postalCode: address.postalCode ?? null,
                    phone: address.phone ?? null,
                }
            }),
        }
    });
}

exports.allAddresses = (addresses) => {
    return addresses.map(address => {
        return {
            id: address._id,
            alias: address.alias,
            street: address.street,
            region: address.region,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode ?? null,
            phone: address.phone ?? null,
        }
    })
}

exports.adminData = (admin) => {
    return {
        id: admin._id,
        nid: admin.nid,
        name: admin.name,
        userName: admin.username,
        phone: admin.phone,
        imageId: admin.profileImg.public_id,
        profileImg: admin.profileImg.secure_url ?? null,
        gender: admin.gender ?? null,
        role: admin.role,
    }
}

exports.allAdminData = (admins) => {
    return admins.map(admin => {
        return {
            id: admin._id,
            nid: admin.nid,
            name: admin.name,
            userName: admin.username,
            phone: admin.phone,
            gender: admin.gender ?? null,
            role: admin.role,
        }
    });
}

exports.allProductData = (products) => {
    return products.map((product) => {
        return {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            isAvailable: product.isAvailable,
            owner: {
                id: product.owner._id,
                name: product.owner.name,
            },
            category: product.category.title,
            style: product.style.title,
            subject: product.subject.title,
            size: `${product.height}h * ${product.width}w * ${product.depth}d`,
            coverImage: {
                imageId: product.coverImage.public_id,
                profileImg: product.coverImage.secure_url ?? null,
            },
            material: product.material ?? null,
            inEvent: product.inEvent ?? false,
        }
    })
}

exports.productData = (product) => {
    return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        isAvailable: product.isAvailable,
        owner: {
            id: product.owner._id,
            name: product.owner.name,
            profileImg: product.owner.profileImg.secure_url ?? null,
        },
        category: product.category.title,
        style: product.style.title,
        subject: product.subject.title,
        height: product.height,
        width: product.width,
        depth: product.depth,
        size: `${product.height}h * ${product.width}w * ${product.depth}d`,
        coverImage: {
            imageId: product.coverImage.public_id,
            profileImg: product.coverImage.secure_url ?? null,
        },
        images: product.images ? product.images.map(image => {
            return {
                imageId: image.public_id,
                profileImg: image.secure_url,
            }
        }) : [],
        material: product.material ?? null,
    }
}

exports.eventData = (event) => {
    return {
        id: event._id,
        title: event.title,
        description: event.description,
        owner: {
            id: event.owner._id,
            name: event.owner.name,
        },
        duration: event.duration,
        began: event.began,
        end: event.end,
        products: event.products.map(product => {
            return {
                id: product._id,
                title: product.title,
                price: product.price,
                owner: {
                    id: product.owner._id,
                    name: product.owner.name,
                },
            }
        }),
    }
}

exports.allEventData = (events) => {
    return events.map(event => {
        return {
            id: event._id,
            title: event.title,
            description: event.description,
            owner: {
                id: event.owner._id,
                name: event.owner.name,
                profileImg: event.owner.profileImg.secure_url ?? null,
            },
            duration: event.duration,
            began: event.began,
            end: event.end,
        }
    });
}

exports.allProductInEventData = (products) => {
    return products.map((product) => {
        return {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            isAvailable: product.isAvailable,
            owner: {
                id: product.owner._id,
                name: product.owner.name,
            },
            category: product.category.title,
            style: product.style.title,
            subject: product.subject.title,
            size: `${product.height}h * ${product.width}w * ${product.depth}d`,
            coverImage: {
                imageId: product.coverImage.public_id,
                profileImg: product.coverImage.secure_url ?? null,
            },
            images: product.images.map(image => {
                return {
                    imageId: image.public_id,
                    profileImg: image.secure_url ?? null,
                }
            }),
            material: product.material ?? null,
        }
    })
}

exports.productInEventData = (product) => {
    return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        isAvailable: product.isAvailable,
        owner: {
            id: product.owner._id,
            name: product.owner.name,
        },
        category: product.category.title,
        style: product.style.title,
        subject: product.subject.title,
        size: `${product.height}h * ${product.width}w * ${product.depth}d`,
        coverImage: {
            imageId: product.coverImage.public_id,
            profileImg: product.coverImage.secure_url ?? null,
        },
        images: product.images.map(image => {
            return {
                imageId: image.public_id,
                profileImg: image.secure_url ?? null,
            }
        }),
        material: product.material ?? null,
    }
}

exports.searchData = (artists, products, events) => {
    return {
        resultCount: artists.length + products.length + events.length,
        products: products.map((product) => {
            return {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                isAvailable: product.isAvailable,
                owner: {
                    id: product.owner._id,
                    name: product.owner.name,
                },
                category: product.category.title,
                profileImg: product.coverImage.secure_url ?? null,
            }
        }),
        artists: artists.map(artist => {
            return {
                id: artist._id,
                name: artist.name,
                email: artist.email,
                profileImg: artist.profileImg.secure_url ?? null,
                accountActive: artist.accountActive,
            }
        }),
        events: events.map(event => {
            return {
                id: event._id,
                title: event.title,
                description: event.description,
                owner: {
                    id: event.owner._id,
                    name: event.owner.name,
                },
                duration: event.duration,
                began: event.began,
                end: event.end,
            }
        }),
    }
}

exports.cartData = (cart) => {
    return {
        id: cart._id,
        itemCount: cart.cartItems.length,
        user: {
            id: cart.user._id,
            name: cart.user.name,
        },
        totalCartPrice: cart.totalCartPrice,
        cartItems: cart.cartItems.map(item => {
            return {
                product: {
                    id: item.product._id,
                    title: item.product.title,
                    description: item.product.description,
                    price: item.product.price,
                    owner: {
                        id: item.product.owner._id,
                        name: item.product.owner.name,
                    },
                    category: item.product.category.title,
                    style: item.product.style.title,
                    subject: item.product.subject.title,
                    size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                    coverImage: {
                        imageId: item.product.coverImage.public_id,
                        profileImg: item.product.coverImage.secure_url ?? null,
                    },
                    material: item.product.material ?? null,
                },
                price: item.price
            }
        }),
    }
}

exports.orderData = (order) => {
    return {
        id: order._id,
        user: {
            id: order.user._id,
            name: order.user.name,
        },
        shippingAddress: {
            alias: order.shippingAddress.alias,
            street: order.shippingAddress.street,
            region: order.shippingAddress.region,
            city: order.shippingAddress.city,
            country: order.shippingAddress.country,
            postalCode: order.shippingAddress.postalCode ?? null,
            phone: order.shippingAddress.phone ?? null,
        },
        cartItems: order.cartItems.map(item => {
            return {
                product: {
                    id: item.product._id,
                    title: item.product.title,
                    description: item.product.description,
                    price: item.product.price,
                    owner: {
                        id: item.product.owner._id,
                        name: item.product.owner.name,
                    },
                    category: item.product.category.title,
                    style: item.product.style.title,
                    subject: item.product.subject.title,
                    size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                    coverImage: {
                        imageId: item.product.coverImage.public_id,
                        profileImg: item.product.coverImage.secure_url ?? null,
                    },
                    material: item.product.material ?? null,
                },
                price: item.price
            }
        }),
        totalOrderPrice: order.totalOrderPrice,
        paymentMethodType: order.paymentMethodType,
        currency: order.currency,
        isPaid: order.isPaid,
        paidAt: order.paidAt ?? null,
        orderState: order.orderState,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt ?? null,
    }
}

exports.allOrderData = (orders) => {
    return orders.map((order) => {
        return {
            id: order._id,
            user: {
                id: order.user._id,
                name: order.user.name,
            },
            shippingAddress: {
                alias: order.shippingAddress.alias,
                street: order.shippingAddress.street,
                region: order.shippingAddress.region,
                city: order.shippingAddress.city,
                country: order.shippingAddress.country,
                postalCode: order.shippingAddress.postalCode ?? null,
                phone: order.shippingAddress.phone ?? null,
            },
            cartItems: order.cartItems.map(item => {
                return {
                    product: {
                        id: item.product._id,
                        title: item.product.title,
                        description: item.product.description,
                        price: item.product.price,
                        owner: {
                            id: item.product.owner._id,
                            name: item.product.owner.name,
                        },
                        category: item.product.category.title,
                        style: item.product.style.title,
                        subject: item.product.subject.title,
                        size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                        coverImage: {
                            imageId: item.product.coverImage.public_id,
                            profileImg: item.product.coverImage.secure_url ?? null,
                        },
                        material: item.product.material ?? null,
                    },
                    price: item.price
                }
            }),
            totalOrderPrice: order.totalOrderPrice,
            paymentMethodType: order.paymentMethodType,
            currency: order.currency,
            isPaid: order.isPaid,
            paidAt: order.paidAt ?? null,
            orderState: order.orderState,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt ?? null,
        }
    })
}

exports.allComplaintData = (complaints) => {
    return complaints.map((complaint) => {
        return {
            id: complaint._id,
            user: complaint.sender.user ? {
                id: complaint.sender.user._id,
                name: complaint.sender.user.name,
                email: complaint.sender.user.email,
                phone: complaint.sender.user.phone,
                gender: complaint.sender.user.gender ?? null,
            } : undefined,
            artist: complaint.sender.artist ? {
                id: complaint.sender.artist._id,
                name: complaint.sender.artist.name,
                email: complaint.sender.artist.email,
                phone: complaint.sender.artist.phone,
                gender: complaint.sender.artist.gender ?? null,
            } : undefined,
            message: complaint.message,
            imageId: complaint.attachment.public_id,
            attachment: complaint.attachment.secure_url ?? null,
        }
    })
}

exports.allAuctionData = (auctions) => {
    return auctions.map((auction) => {
        return {
            id: auction._id,
            title: auction.title,
            description: auction.description,
            price: auction.price,
            isAvailable: auction.isAvailable,
            artist: {
                id: auction.artist._id,
                name: auction.artist.name,
            },
            category: auction.category.title,
            style: auction.style.title,
            subject: auction.subject.title,
            size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
            coverImage: {
                imageId: auction.coverImage.public_id,
                profileImg: auction.coverImage.secure_url ?? null,
            },
            images: auction.images.map(image => {
                return {
                    imageId: image.public_id,
                    profileImg: image.secure_url ?? null,
                }
            }),
            material: auction.material ?? null,
            duration: auction.duration,
            began: auction.began,
            end: auction.end,
        }
    })
}

exports.productFromAuctionData = (auction) => {
    return {
        id: auction._id,
        title: auction.title,
        description: auction.description,
        price: auction.price,
        isAvailable: auction.isAvailable,
        artist: {
            id: auction.artist._id,
            name: auction.artist.name,
        },
        category: auction.category.title,
        style: auction.style.title,
        subject: auction.subject.title,
        size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
        coverImage: {
            imageId: auction.coverImage.public_id,
            profileImg: auction.coverImage.secure_url ?? null,
        },
        images: auction.images.map(image => {
            return {
                imageId: image.public_id,
                profileImg: image.secure_url ?? null,
            }
        }),
        material: auction.material ?? null,
        duration: auction.duration,
        began: auction.began,
        end: auction.end,
    };
}

exports.allCategoryData = (categories) => {
    return categories.map((category) => {
        return {
            id: category._id,
            title: category.title,
        }
    })
}

exports.allStyleData = (styles) => {
    return styles.map((style) => {
        return {
            id: style._id,
            title: style.title,
        }
    })
}

exports.allSubjectData = (subjects) => {
    return subjects.map((subject) => {
        return {
            id: subject._id,
            title: subject.title,
        }
    })
}