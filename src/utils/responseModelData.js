exports.artistData = (artist) => {
    return {
        id: artist._id,
        name: artist.name,
        bio: artist.bio ?? null,
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
            bio: artist.bio ?? null,
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

exports.allRegisterAuction = (auctions) => {
    return auctions.map(auction => {
        return {
            id: auction._id,
            title: auction.title,
            description: auction.description,
            price: auction.finalPrice,
            isAvailable: auction.isAvailable,
            artist: {
                id: auction.artist._id,
                name: auction.artist.name,
                profileImg: auction.artist.profileImg.secure_url ?? null,
            },
            category: auction.category.title,
            style: auction.style.title,
            subject: auction.subject.title,
            size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
            coverImage: {
                imageId: auction.coverImage.public_id,
                image: auction.coverImage.secure_url ?? null,
            },
            images: auction.images.map(image => {
                return {
                    imageId: image.public_id,
                    image: image.secure_url ?? null,
                }
            }),
            material: auction.material ?? null,
            duration: auction.duration,
            began: auction.began,
            end: auction.end,
            finalUser: auction.finalUser ? {
                id: auction.finalUser._id,
                name: auction.finalUser.name,
            } : null,
            isLaunch: auction.isLaunch,
            isEnded: auction.isEnded,
        }
    });
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
                profileImg: product.owner.profileImg.secure_url ?? null,
            },
            category: product.category.title,
            style: product.style.title,
            subject: product.subject.title,
            size: `${product.height}h * ${product.width}w * ${product.depth}d`,
            coverImage: {
                imageId: product.coverImage.public_id,
                image: product.coverImage.secure_url ?? null,
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
        owner: product.owner ? {
            id: product.owner._id ?? null,
            name: product.owner.name,
            profileImg: product.owner.profileImg.secure_url ?? null,
        } : null,
        category: product.category ? product.category.title : null,
        style: product.style ? product.style.title : null,
        subject: product.subject ? product.subject.title : null,
        height: product.height,
        width: product.width,
        depth: product.depth,
        size: `${product.height}h * ${product.width}w * ${product.depth}d`,
        coverImage: product.coverImage ? {
            imageId: product.coverImage.public_id,
            image: product.coverImage.secure_url ?? null,
        } : null,
        images: product.images ? product.images.map(image => {
            return {
                imageId: image.public_id,
                image: image.secure_url,
            }
        }) : [],
        material: product.material ?? null,
    }
}

exports.eventData = (event, userBookedThisEvent) => {
    return {
        id: event._id,
        title: event.title,
        description: event.description,
        imageId: event.coverImage.public_id,
        coverImage: event.coverImage.secure_url ?? null,
        owner: event.owner ? {
            id: event.owner._id,
            name: event.owner.name,
            profileImg: event.owner.profileImg.secure_url ?? null,
        } : null,
        duration: event.duration,
        began: event.began,
        end: event.end,
        userBookedThisEvent: userBookedThisEvent,
        products: event.products.map(product => {
            return {
                id: product._id,
                title: product.title,
                price: product.price,
                coverImage: product.coverImage ? product.coverImage.secure_url ?? null : null,
                category: product.category ? product.category.title : null,
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
            imageId: event.coverImage.public_id,
            coverImage: event.coverImage.secure_url ?? null,
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
                profileImg: product.owner.profileImg.secure_url ?? null,
            },
            category: product.category.title,
            style: product.style.title,
            subject: product.subject.title,
            size: `${product.height}h * ${product.width}w * ${product.depth}d`,
            coverImage: {
                imageId: product.coverImage.public_id,
                image: product.coverImage.secure_url ?? null,
            },
            images: product.images.map(image => {
                return {
                    imageId: image.public_id,
                    image: image.secure_url ?? null,
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
            profileImg: product.owner.profileImg.secure_url ?? null,
        },
        category: product.category.title,
        style: product.style.title,
        subject: product.subject.title,
        size: `${product.height}h * ${product.width}w * ${product.depth}d`,
        coverImage: {
            imageId: product.coverImage.public_id,
            image: product.coverImage.secure_url ?? null,
        },
        images: product.images.map(image => {
            return {
                imageId: image.public_id,
                image: image.secure_url ?? null,
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
                    profileImg: product.owner.profileImg.secure_url ?? null,
                },
                category: product.category.title,
                coverImage: product.coverImage.secure_url ?? null,
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
                coverImage: event.coverImage.secure_url ?? null,
                owner: {
                    id: event.owner._id,
                    name: event.owner.name,
                    profileImg: event.owner.profileImg.secure_url ?? null,
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
                        profileImg: item.product.owner.profileImg.secure_url ?? null,
                    },
                    category: item.product.category.title,
                    style: item.product.style.title,
                    subject: item.product.subject.title,
                    size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                    coverImage: {
                        imageId: item.product.coverImage.public_id,
                        image: item.product.coverImage.secure_url ?? null,
                    },
                    material: item.product.material ?? null,
                },
                price: item.price
            }
        }),
    }
}

exports.orderData = (order, address) => {
    return {
        id: order._id,
        user: {
            id: order.user._id,
            name: order.user.name,
        },
        shippingAddress: address ? {
            alias: address.alias,
            street: address.street,
            region: address.region,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode ?? null,
            phone: address.phone ?? null,
        } : null,
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
                        profileImg: item.product.owner.profileImg.secure_url ?? null,
                    },
                    category: item.product.category.title,
                    style: item.product.style.title,
                    subject: item.product.subject.title,
                    size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                    coverImage: {
                        imageId: item.product.coverImage.public_id,
                        image: item.product.coverImage.secure_url ?? null,
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
                            profileImg: item.product.owner.profileImg.secure_url ?? null,
                        },
                        category: item.product.category.title,
                        style: item.product.style.title,
                        subject: item.product.subject.title,
                        size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                        coverImage: {
                            imageId: item.product.coverImage.public_id,
                            image: item.product.coverImage.secure_url ?? null,
                        },
                        material: item.product.material ?? null,
                    },
                    price: item.price
                }
            }),
            totalOrderPrice: order.totalOrderPrice,
            paymentMethodType: order.paymentMethodType,
            currency: order.currency ?? null,
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
            price: auction.finalPrice,
            isAvailable: auction.isAvailable,
            artist: {
                id: auction.artist._id,
                name: auction.artist.name,
                profileImg: auction.artist.profileImg.secure_url ?? null,
            },
            category: auction.category.title,
            style: auction.style.title,
            subject: auction.subject.title,
            size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
            coverImage: {
                imageId: auction.coverImage.public_id,
                image: auction.coverImage.secure_url ?? null,
            },
            images: auction.images.map(image => {
                return {
                    imageId: image.public_id,
                    image: image.secure_url ?? null,
                }
            }),
            material: auction.material ?? null,
            duration: auction.duration,
            began: auction.began,
            end: auction.end,
            finalUser: auction.finalUser ? {
                id: auction.finalUser._id,
                name: auction.finalUser.name,
            } : null,
            isLaunch: auction.isLaunch,
            isEnded: auction.isEnded,
        }
    })
}

exports.productFromAuctionData = (auction, userRegisteredInThisAuction) => {
    return {
        id: auction._id,
        title: auction.title,
        description: auction.description,
        price: auction.finalPrice,
        isAvailable: auction.isAvailable,
        artist: {
            id: auction.artist._id,
            name: auction.artist.name,
            profileImg: auction.artist.profileImg.secure_url ?? null,
        },
        category: auction.category.title,
        style: auction.style.title,
        subject: auction.subject.title,
        size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
        coverImage: {
            imageId: auction.coverImage.public_id,
            image: auction.coverImage.secure_url ?? null,
        },
        images: auction.images.map(image => {
            return {
                imageId: image.public_id,
                image: image.secure_url ?? null,
            }
        }),
        material: auction.material ?? null,
        duration: auction.duration,
        began: auction.began,
        end: auction.end,
        finalUser: auction.finalUser ? {
            id: auction.finalUser._id,
            name: auction.finalUser.name,
        } : null,
        isLaunch: auction.isLaunch,
        isEnded: auction.isEnded,
        userRegisteredInThisAuction: userRegisteredInThisAuction,
        lastPrices: auction.lastPrices ? auction.lastPrices.map(lastPrice => {
            return {
                user: {
                    id: lastPrice.user._id,
                    name: lastPrice.user.name,
                },
                price: lastPrice.price,
            }
        }) : [],
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

exports.registerAuctionData = (registerAuction) => {
    return {
        id: registerAuction._id,
        auctions: registerAuction.auctions.map(auction => {
            return {
                refundId: auction.refundId,
                auctionId: auction.auctionId._id,
                title: auction.auctionId.title,
                category: auction.auctionId.category.title,
                duration: auction.auctionId.duration,
                began: auction.auctionId.began,
                coverImage: auction.auctionId.coverImage.secure_url ?? null,
                artistId: auction.auctionId.artist._id,
                artistName: auction.auctionId.artist.name,
                profileImg: auction.auctionId.artist.profileImg.secure_url ?? null,
                finalPrice: auction.auctionId.finalPrice,
                isLaunch: auction.auctionId.isLaunch,
                isEnded: auction.auctionId.isEnded,
            }
        }),
    }
}

exports.bookEventData = (bookEvent) => {
    return {
        id: bookEvent._id,
        events: bookEvent.events.map(event => {
            return {
                id: event._id,
                title: event.title,
                description: event.description,
                duration: event.duration,
                began: event.began,
                end: event.end,
                isLaunch: event.isLaunch,
                coverImage: event.coverImage.secure_url ?? null,
                ownerId: event.owner._id,
                ownerName: event.owner.name,
                profileImg: event.owner.profileImg.secure_url ?? null,
            }
        }),
    }
}

exports.availableProductsReport = (availableProducts) => {
    return availableProducts.map(availableProduct => {
        return {
            id: availableProduct._id,
            title: availableProduct.title,
            description: availableProduct.description,
            price: availableProduct.price,
            owner: availableProduct.owner ? availableProduct.owner.name : null,
            category: availableProduct.category ? availableProduct.category.title : null,
            style: availableProduct.style ? availableProduct.style.title : null,
            subject: availableProduct.subject ? availableProduct.subject.title : null,
            material: availableProduct.material ?? null,
            height: availableProduct.height,
            width: availableProduct.width,
            depth: availableProduct.depth,
            createdAt: availableProduct.createdAt
        }
    })
}

exports.unavailableProductsReport = (unavailableProducts) => {
    return unavailableProducts.map(unavailableProduct => {
        return {
            productId: unavailableProduct.product._id,
            title: unavailableProduct.product.title,
            description: unavailableProduct.product.description,
            price: unavailableProduct.product.price,
            owner: unavailableProduct.product.owner ? unavailableProduct.product.owner.name : null,
            category: unavailableProduct.product.category ? unavailableProduct.product.category.title : null,
            style: unavailableProduct.product.style ? unavailableProduct.product.style.title : null,
            subject: unavailableProduct.product.subject ? unavailableProduct.product.subject.title : null,
            material: unavailableProduct.product.material ?? null,
            height: unavailableProduct.product.height,
            width: unavailableProduct.product.width,
            depth: unavailableProduct.product.depth,
            productCreatedAt: unavailableProduct.product.createdAt,
            orderId: unavailableProduct.order._id,
            soldUserId: unavailableProduct.order.user._id,
            soldUserName: unavailableProduct.order.user.name,
            totalOrderPrice: unavailableProduct.order.totalOrderPrice,
            paymentMethodType: unavailableProduct.order.paymentMethodType,
            currency: unavailableProduct.order.currency,
            isPaid: unavailableProduct.order.isPaid,
            paidAt: unavailableProduct.order.paidAt ?? null,
            orderState: unavailableProduct.order.orderState,
            isDelivered: unavailableProduct.order.isDelivered,
            deliveredAt: unavailableProduct.order.deliveredAt ?? null,
        }
    })
}

exports.artistStatisticReport = (artistsStatistic) => {
    return artistsStatistic.map(artistStatistic => {
        return {
            id: artistStatistic.artist._id,
            name: artistStatistic.artist.name,
            bio: artistStatistic.artist.bio ?? null,
            email: artistStatistic.artist.email,
            phone: artistStatistic.artist.phone,
            gender: artistStatistic.artist.gender ?? null,
            accountActive: artistStatistic.artist.accountActive,
            allProductsCount: artistStatistic.products,
            allEventsCount: artistStatistic.events,
            allAuctionsCount: artistStatistic.auctions,
        }
    });
}

exports.singleArtistStatisticReport = (artist, products, events, auctions) => {
    return {
        id: artist._id,
        name: artist.name,
        bio: artist.bio ?? null,
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
        availableProducts: products.map(product => {
            return {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                isAvailable: product.isAvailable,
                category: product.category ? product.category.title : null,
                style: product.style ? product.style.title : null,
                subject: product.subject ? product.subject.title : null,
                height: product.height,
                width: product.width,
                depth: product.depth,
                size: `${product.height}h * ${product.width}w * ${product.depth}d`,
                coverImage: product.coverImage ? {
                    imageId: product.coverImage.public_id,
                    image: product.coverImage.secure_url ?? null,
                } : null,
                images: product.images ? product.images.map(image => {
                    return {
                        imageId: image.public_id,
                        image: image.secure_url,
                    }
                }) : [],
                material: product.material ?? null,
            }
        }),
        availableEvents: events.map(event => {
            return {
                id: event._id,
                title: event.title,
                description: event.description,
                imageId: event.coverImage.public_id,
                coverImage: event.coverImage.secure_url ?? null,
                duration: event.duration,
                began: event.began,
                end: event.end,
            }
        }),
        availableAuctions: auctions.map(auction => {
            return {
                id: auction._id,
                title: auction.title,
                description: auction.description,
                price: auction.finalPrice,
                isAvailable: auction.isAvailable,
                category: auction.category.title,
                style: auction.style.title,
                subject: auction.subject.title,
                size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
                coverImage: {
                    imageId: auction.coverImage.public_id,
                    image: auction.coverImage.secure_url ?? null,
                },
                images: auction.images.map(image => {
                    return {
                        imageId: image.public_id,
                        image: image.secure_url ?? null,
                    }
                }),
                material: auction.material ?? null,
                duration: auction.duration,
                began: auction.began,
                end: auction.end,
                finalUser: auction.finalUser ? {
                    id: auction.finalUser._id,
                    name: auction.finalUser.name,
                } : null,
                isLaunch: auction.isLaunch,
                isEnded: auction.isEnded,
                lastPrices: auction.lastPrices ? auction.lastPrices.map(lastPrice => {
                    return {
                        user: {
                            id: lastPrice.user._id,
                            name: lastPrice.user.name,
                        },
                        price: lastPrice.price,
                    }
                }) : [],
            }
        }),
    }
}

exports.lastEventsReport = (events) => {
    return events.map(event => {
        return {
            id: event._id,
            title: event.title,
            description: event.description,
            imageId: event.coverImage.public_id,
            coverImage: event.coverImage.secure_url ?? null,
            ownerId: event.owner._id,
            ownerName: event.owner.name,
            ownerProfileImg: event.owner.profileImg.secure_url ?? null,
            duration: event.duration,
            began: event.began,
            end: event.end,
            launch: event.isLaunch
        }
    });
}

exports.lastAuctionsReport = (auctions) => {
    return auctions.map((auction) => {
        return {
            id: auction._id,
            title: auction.title,
            description: auction.description,
            price: auction.finalPrice,
            isAvailable: auction.isAvailable,
            artistId: auction.artist._id,
            artistName: auction.artist.name,
            artistProfileImg: auction.artist.profileImg.secure_url ?? null,
            category: auction.category.title,
            style: auction.style.title,
            subject: auction.subject.title,
            size: `${auction.height}h * ${auction.width}w * ${auction.depth}d`,
            imageId: auction.coverImage.public_id,
            coverImage: auction.coverImage.secure_url ?? null,
            material: auction.material ?? null,
            duration: auction.duration,
            began: auction.began,
            end: auction.end,
            finalUserId: auction.finalUser ? auction.finalUser._id: null,
            finalUserName: auction.finalUser ? auction.finalUser.name: null,
            isLaunch: auction.isLaunch,
            isEnded: auction.isEnded,
        }
    })
}